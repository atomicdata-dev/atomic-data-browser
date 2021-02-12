import ed from 'noble-ed25519';
import stringify from 'json-stable-stringify';
import { decode, encode } from 'base64-arraybuffer';
import { urls } from '../helpers/urls';

export interface CommitBuilder {
  subject: string;
  set?: Record<string, string>;
  remove?: string[];
  destroy?: boolean;
}

interface CommitPreSigned extends CommitBuilder {
  signer: string;
  createdAt: number;
}

export interface Commit extends CommitPreSigned {
  signature: string;
}

function hexToBase64(hexstring: string) {
  return btoa(
    hexstring
      .match(/\w{2}/g)
      .map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
      })
      .join(''),
  );
}

/** Replaces a key in a Commit. Ignores it if it's not there */
function replaceKey(o: Commit | CommitPreSigned, oldKey: string, newKey: string) {
  if (oldKey in o && oldKey !== newKey) {
    Object.defineProperty(o, newKey, Object.getOwnPropertyDescriptor(o, oldKey));
    delete o[oldKey];
  }
}

/** Takes a commit (without signature) and serializes it deterministically. */
export function serializeDeterministically(commit: CommitPreSigned | Commit): string {
  // @ts-ignore Prevent devs from making the same mistake I made
  if (commit.signature !== undefined) {
    // @ts-ignore Prevent devs from making the same mistake I made
    delete commit.signature;
    // throw Error("You're trying to deterministicall serialize a Commit with a signature - you need one without its signature!");
  }
  replaceKey(commit, 'createdAt', urls.properties.commit.createdAt);
  replaceKey(commit, 'subject', urls.properties.commit.subject);
  replaceKey(commit, 'set', urls.properties.commit.set);
  replaceKey(commit, 'signer', urls.properties.commit.signer);
  replaceKey(commit, 'remove', urls.properties.commit.remove);
  replaceKey(commit, 'destroy', urls.properties.commit.destroy);

  return stringify(commit);
}

/** Creates a signature for a Commit using the private Key of some Agent. */
export const signAt = async (commitBuilder: CommitBuilder, agent: string, privateKey: string, createdAt: number): Promise<Commit> => {
  const commitPreSigned: CommitPreSigned = {
    ...commitBuilder,
    createdAt: createdAt,
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

/** Signs a string using a base64 encoded ed25519 private key. Outputs a base64 encoded ed25519 signature */
export const signToBase64 = async (message: string, privateKeyBase64: string): Promise<string> => {
  const privateKeyArrayBuffer = decode(privateKeyBase64);
  const privateKeyBytes: Uint8Array = new Uint8Array(privateKeyArrayBuffer);
  const utf8Encode = new TextEncoder();
  const messageBytes: Uint8Array = utf8Encode.encode(message);
  const signatureHex = await ed.sign(messageBytes, privateKeyBytes);
  const signatureBase64 = encode(signatureHex);
  return signatureBase64;
};

/** From base64 encoded private key */
export const generatePublicKeyFromPrivate = async (privateKey: string): Promise<string> => {
  const privateKeyArrayBuffer = decode(privateKey);
  const privateKeyBytes: Uint8Array = new Uint8Array(privateKeyArrayBuffer);
  const publickey = await ed.getPublicKey(privateKeyBytes);
  const signatureBase64 = encode(publickey);
  return signatureBase64;
};
