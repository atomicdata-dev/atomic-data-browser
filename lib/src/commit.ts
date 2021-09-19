import { sign, getPublicKey, utils } from 'noble-ed25519';
import stringify from 'json-stable-stringify';
import { decode as decodeB64, encode as encodeB64 } from 'base64-arraybuffer';
import { urls } from './urls';
import { JSVals, Value } from './value';
import { Store } from './store';
import { Resource } from '.';

export interface CommitBuilderI {
  subject: string;
  set?: Record<string, JSVals>;
  remove?: string[];
  destroy?: boolean;
}

/** A Commit without signature */
export class CommitBuilder implements CommitBuilderI {
  subject: string;
  set: Record<string, JSVals>;
  remove: string[];
  destroy?: boolean;

  constructor(subject: string) {
    this.subject = subject;
    this.set = {};
    this.remove = [];
  }

  /**
   * Signs the commit using the privateKey of the Agent, and returns a full
   * Commit which is ready to be sent to an Atomic-Server `/commit` endpoint
   */
  async sign(privateKey: string, agentSubject: string): Promise<Commit> {
    const now: number = Math.round(new Date().getTime());
    const commit = await signAt(this, agentSubject, privateKey, now);
    return commit;
  }

  hasUnsavedChanges(): boolean {
    return (
      Object.keys(this.set).length > 0 || this.destroy || this.remove.length > 0
    );
  }
}

interface CommitPreSigned extends CommitBuilderI {
  signer: string;
  // Unix timestamp in milliseconds
  createdAt: number;
}

export interface Commit extends CommitPreSigned {
  signature: string;
}

/** Replaces a key in a Commit. Ignores it if it's not there */
function replaceKey(
  o: Commit | CommitPreSigned,
  oldKey: string,
  newKey: string,
) {
  if (oldKey in o && oldKey !== newKey) {
    Object.defineProperty(
      o,
      newKey,
      Object.getOwnPropertyDescriptor(o, oldKey),
    );
    delete o[oldKey];
  }
}

/**
 * Takes a commit and serializes it deterministically. Is used both for signing
 * Commits as well as serializing them.
 */
export function serializeDeterministically(
  commit: CommitPreSigned | Commit,
): string {
  // Remove empty arrays, objects, false values from root
  if (commit.remove?.length == 0) {
    delete commit.remove;
  }
  if (commit.set?.length == 0) {
    delete commit.remove;
  }
  replaceKey(commit, 'createdAt', urls.properties.commit.createdAt);
  replaceKey(commit, 'subject', urls.properties.commit.subject);
  replaceKey(commit, 'set', urls.properties.commit.set);
  replaceKey(commit, 'signer', urls.properties.commit.signer);
  replaceKey(commit, 'signature', urls.properties.commit.signature);
  replaceKey(commit, 'remove', urls.properties.commit.remove);
  replaceKey(commit, 'destroy', urls.properties.commit.destroy);
  commit[urls.properties.isA] = [urls.classes.commit];
  return stringify(commit);
}

/** Creates a signature for a Commit using the private Key of some Agent. */
export const signAt = async (
  commitBuilder: CommitBuilderI,
  agent: string,
  privateKey: string,
  createdAt: number,
): Promise<Commit> => {
  if (agent == undefined) {
    throw new Error('No agent passed to sign commit');
  }
  const commitPreSigned: CommitPreSigned = {
    ...commitBuilder,
    createdAt,
    signer: agent,
  };
  const serializedCommit = serializeDeterministically(commitPreSigned);
  const signature = await signToBase64(serializedCommit, privateKey);
  const commitPostSigned: Commit = {
    ...commitPreSigned,
    signature,
  };
  return commitPostSigned;
};

/**
 * Signs a string using a base64 encoded ed25519 private key. Outputs a base64
 * encoded ed25519 signature
 */
export const signToBase64 = async (
  message: string,
  privateKeyBase64: string,
): Promise<string> => {
  const privateKeyArrayBuffer = decodeB64(privateKeyBase64);
  const privateKeyBytes: Uint8Array = new Uint8Array(privateKeyArrayBuffer);
  const utf8Encode = new TextEncoder();
  const messageBytes: Uint8Array = utf8Encode.encode(message);
  const signatureHex = await sign(messageBytes, privateKeyBytes);
  const signatureBase64 = encodeB64(signatureHex);
  return signatureBase64;
};

/** From base64 encoded private key */
export const generatePublicKeyFromPrivate = async (
  privateKey: string,
): Promise<string> => {
  const privateKeyArrayBuffer = decodeB64(privateKey);
  const privateKeyBytes: Uint8Array = new Uint8Array(privateKeyArrayBuffer);
  const publickey = await getPublicKey(privateKeyBytes);
  const publicBase64 = encodeB64(publickey);
  return publicBase64;
};

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export async function generateKeyPair(): Promise<KeyPair> {
  const privateBytes = utils.randomPrivateKey();
  const publicBytes = await getPublicKey(privateBytes);
  const privateKey = encodeB64(privateBytes);
  const publicKey = encodeB64(publicBytes);
  return {
    publicKey,
    privateKey,
  };
}

/** Parses a JSON-AD Commit, applies it to the store. Does not perform checks */
export function parseAndApply(jsonAdObjStr: string, store: Store) {
  const jsonAdObj = JSON.parse(jsonAdObjStr);
  // Parses the commit
  const subject = jsonAdObj[urls.properties.commit.subject];
  const set = jsonAdObj[urls.properties.commit.set];
  const remove: string[] | undefined = jsonAdObj[urls.properties.commit.remove];
  const destroy: boolean | undefined =
    jsonAdObj[urls.properties.commit.destroy];
  // const createdAt = jsonAdObj[urls.properties.commit.createdAt];
  // const signer = jsonAdObj[urls.properties.commit.signer];
  // const signature = jsonAdObj[urls.properties.commit.signature];

  let resource = store.resources.get(subject);

  // If the resource doesn't exist in the store, create the resource
  if (resource == undefined) {
    resource = new Resource(subject);
  }

  set &&
    Object.keys(set).forEach(propUrl => {
      const val = new Value(set[propUrl]);
      resource.setUnsafe(propUrl, val);
    });

  remove &&
    remove.forEach(propUrl => {
      resource.removePropValLocally(propUrl);
    });

  if (destroy) {
    store.removeResource(subject);
    return;
  } else {
    store.addResource(resource);
  }
}
