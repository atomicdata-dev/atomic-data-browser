import ed from 'noble-ed25519';
import stringify from 'json-stable-stringify';
import { decode } from 'base64-arraybuffer';

export interface CommitBuilder {
  subject: string;
  set?: Record<string, string>;
  remove?: string[];
  destroy?: boolean;
}

interface CommitPreSigned extends CommitBuilder {
  signer: string;
  created_at: number;
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

/** Takes a commit (without signature) and serializes it deterministically. */
export function serializeDeterministically(commit: CommitPreSigned): string {
  return stringify(commit);
}

/** Creates a signature for a Commit using the private Key of some Agent. */
export const signAt = async (commitBuilder: CommitBuilder, agent: string, privateKey: string, createdAt: number): Promise<Commit> => {
  const commitPreSigned: CommitPreSigned = {
    ...commitBuilder,
    created_at: createdAt,
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
  // Things are correct here
  const signatureHex = await ed.sign(message, privateKeyBytes);
  console.log('signatureHex', signatureHex);
  const signatureBase64 = hexToBase64(signatureHex);
  return signatureBase64;
};
