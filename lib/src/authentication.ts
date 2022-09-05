import { Agent, getTimestampNow, HeadersObject, signToBase64 } from '.';

/** Returns a JSON-AD resource of an Authentication */
export async function createAuthentication(subject: string, agent: Agent) {
  const timestamp = getTimestampNow();
  if (!agent.subject) {
    throw new Error('Agent has no subject, cannot authenticate');
  }
  const object = {
    'https://atomicdata.dev/properties/auth/agent': agent.subject,
    'https://atomicdata.dev/properties/auth/requestedSubject': subject,
    'https://atomicdata.dev/properties/auth/publicKey':
      await agent.getPublicKey(),
    'https://atomicdata.dev/properties/auth/timestamp': timestamp,
    'https://atomicdata.dev/properties/auth/signature': await signatureMessage(
      subject,
      agent,
      timestamp,
    ),
  };
  return object;
}

/** Returns a string used to sign requests. */
export async function signatureMessage(
  subject: string,
  agent: Agent,
  timestamp: number,
) {
  const message = `${subject} ${timestamp}`;
  return await signToBase64(message, agent.privateKey);
}

/** Localhost Agents are not allowed to sign requests to external domain */
function localTryingExternal(subject: string, agent: Agent) {
  return (
    !subject.startsWith('http://localhost') &&
    agent?.subject?.startsWith('http://localhost')
  );
}

/**
 * Creates authentication headers and signs the request. Does not add headers if
 * the Agents subject is missing.
 */
export async function signRequest(
  /** The resource meant to be fetched */
  subject: string,
  agent: Agent,
  headers: HeadersObject | Headers,
): Promise<HeadersObject> {
  const timestamp = getTimestampNow();
  if (agent?.subject && !localTryingExternal(subject, agent)) {
    headers['x-atomic-public-key'] = await agent.getPublicKey();
    headers['x-atomic-signature'] = await signatureMessage(
      subject,
      agent,
      timestamp,
    );
    headers['x-atomic-timestamp'] = timestamp;
    headers['x-atomic-agent'] = agent?.subject;
  }

  return headers as HeadersObject;
}
