import ed from "../pkg/noble-ed25519.js";
import stringify from "../pkg/json-stable-stringify.js";
import {decode} from "../pkg/base64-arraybuffer.js";
function hexToBase64(hexstring) {
  return btoa(hexstring.match(/\w{2}/g).map(function(a) {
    return String.fromCharCode(parseInt(a, 16));
  }).join(""));
}
export function serializeDeterministically(commit) {
  return stringify(commit);
}
export const signAt = async (commitBuilder, agent, privateKey, createdAt) => {
  const commitPreSigned = {
    ...commitBuilder,
    created_at: createdAt,
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
  const signatureHex = await ed.sign(message, privateKeyBytes);
  const signatureBase64 = hexToBase64(signatureHex);
  return signatureBase64;
};
