import {
  Agent,
  generateKeyPair,
  getTimestampNow,
  HeadersObject,
  properties,
  signToBase64,
} from './index.js';

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

const ONE_DAY = 24 * 60 * 60 * 1000;

const setCookieExpires = (
  name: string,
  value: string,
  serverUrl: string,
  expires_in_ms = ONE_DAY,
) => {
  const expiry = new Date(Date.now() + expires_in_ms).toUTCString();
  const encodedValue = encodeURIComponent(value);

  const domain = new URL(serverUrl).hostname;

  const cookieString = `${name}=${encodedValue};Expires=${expiry};Domain=${domain};SameSite=Lax;path=/`;
  document.cookie = cookieString;
};

const COOKIE_NAME_AUTH = 'atomic_session';

/** Sets a cookie for the current Agent, signing the Authentication. It expires after some default time. */
export const setCookieAuthentication = (serverURL: string, agent: Agent) => {
  createAuthentication(serverURL, agent).then(auth => {
    setCookieExpires(COOKIE_NAME_AUTH, btoa(JSON.stringify(auth)), serverURL);
  });
};

/** Returns false if the auth cookie is not set / expired */
export const checkAuthenticationCookie = (): boolean => {
  const matches = document.cookie.match(
    /^(.*;)?\s*atomic_session\s*=\s*[^;]+(.*)?$/,
  );

  if (!matches) {
    return false;
  }

  return matches.length > 0;
};

export interface RegisterResult {
  agent: Agent;
  driveURL: string;
}

/** Only lowercase chars, numbers and a hyphen */
export const nameRegex = '^[a-z0-9_-]+';

/** Creates a new Agent + Drive using a shortname and email. Uses the serverURL from the Store. */
export const register = async (
  store: Store,
  name: string,
  email: string,
): Promise<RegisterResult> => {
  const keypair = await generateKeyPair();
  const agent = new Agent(keypair.privateKey);
  const publicKey = await agent.getPublicKey();
  const url = new URL('/register', store.getServerUrl());
  url.searchParams.set('name', name);
  url.searchParams.set('public-key', publicKey);
  url.searchParams.set('email', email);
  const resource = await store.getResourceAsync(url.toString());
  const driveURL = resource.get(properties.redirect.destination) as string;
  const agentSubject = resource.get(
    properties.redirect.redirectAgent,
  ) as string;

  if (resource.error) {
    throw resource.error;
  }

  if (!driveURL) {
    throw new Error('No redirect destination');
  }

  if (!agentSubject) {
    throw new Error('No agent returned');
  }

  agent.subject = agentSubject;

  store.setAgent(agent);

  return { driveURL, agent };
};

export const removeCookieAuthentication = () => {
  document.cookie = `${COOKIE_NAME_AUTH}=;Max-Age=-99999999`;
};
