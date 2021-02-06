import ed from 'noble-ed25519';
import stringify from 'json-stable-stringify';

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

function hexToBase64(hexstring) {
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
  const privateKeyBytes = Uint8Array.from(atob(privateKey), c => c.charCodeAt(0));
  const signatureHex = await ed.sign(serializedCommit, privateKeyBytes);
  const signatureBase64 = hexToBase64(signatureHex);
  const commitPostSigned: Commit = {
    ...commitPreSigned,
    signature: signatureBase64,
  };
  return commitPostSigned;
};
