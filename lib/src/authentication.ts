import { Agent, getTimestampNow, HeadersObject, signToBase64 } from '.';

/** Returns a JSON-AD resource of an Authentication */
export async function createAuthentication(subject: string, agent: Agent) {
  const timestamp = getTimestampNow();
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
  // If you're using a local Agent, you cannot authenticate requests to other domains.
  const localTryingExternal =
    !subject.startsWith('http://localhost') &&
    agent?.subject?.startsWith('http://localhost');
  const timestamp = getTimestampNow();
  if (agent?.subject && !localTryingExternal) {
    headers['x-atomic-public-key'] = await agent.getPublicKey();
    headers['x-atomic-signature'] = await signatureMessage(
      subject,
      agent,
      timestamp,
    );
    headers['x-atomic-timestamp'] = timestamp;
    headers['x-atomic-agent'] = agent?.subject;
  }
  console.log('headers out', headers);
  return headers as HeadersObject;
}
