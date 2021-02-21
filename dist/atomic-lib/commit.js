import ed from "../pkg/noble-ed25519.js";
import stringify from "../pkg/json-stable-stringify.js";
import {decode, encode} from "../pkg/base64-arraybuffer.js";
import {urls} from "../helpers/urls.js";
export class CommitBuilder {
  constructor(subject) {
    this.subject = subject;
    this.set = {};
  }
  async sign(privateKey, agentSubject) {
    const now = Math.round(new Date().getTime());
    const commit = await signAt(this, agentSubject, privateKey, now);
    return commit;
  }
}
function replaceKey(o, oldKey, newKey) {
  if (oldKey in o && oldKey !== newKey) {
    Object.defineProperty(o, newKey, Object.getOwnPropertyDescriptor(o, oldKey));
    delete o[oldKey];
  }
}
export function serializeDeterministically(commit) {
  replaceKey(commit, "createdAt", urls.properties.commit.createdAt);
  replaceKey(commit, "subject", urls.properties.commit.subject);
  replaceKey(commit, "set", urls.properties.commit.set);
  replaceKey(commit, "signer", urls.properties.commit.signer);
  replaceKey(commit, "signature", urls.properties.commit.signature);
  replaceKey(commit, "remove", urls.properties.commit.remove);
  replaceKey(commit, "destroy", urls.properties.commit.destroy);
  commit[urls.properties.isA] = [urls.classes.commit];
  return stringify(commit);
}
export const signAt = async (commitBuilder, agent, privateKey, createdAt) => {
  if (agent == void 0) {
    throw new Error("No agent passed to sign commit");
  }
  const commitPreSigned = {
    ...commitBuilder,
    createdAt,
    signer: agent
  };
  const serializedCommit = serializeDeterministically(commitPreSigned);
  const signature = await signToBase64(serializedCommit, privateKey);
  const commitPostSigned = {
    ...commitPreSigned,
    signature
  };
  return commitPostSigned;
};
export const signToBase64 = async (message, privateKeyBase64) => {
  const privateKeyArrayBuffer = decode(privateKeyBase64);
  const privateKeyBytes = new Uint8Array(privateKeyArrayBuffer);
  const utf8Encode = new TextEncoder();
  const messageBytes = utf8Encode.encode(message);
  const signatureHex = await ed.sign(messageBytes, privateKeyBytes);
  const signatureBase64 = encode(signatureHex);
  return signatureBase64;
};
export const generatePublicKeyFromPrivate = async (privateKey) => {
  const privateKeyArrayBuffer = decode(privateKey);
  const privateKeyBytes = new Uint8Array(privateKeyArrayBuffer);
  const publickey = await ed.getPublicKey(privateKeyBytes);
  const signatureBase64 = encode(publickey);
  return signatureBase64;
};
