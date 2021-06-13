import { tryValidURL } from './client';
import { generatePublicKeyFromPrivate } from './commit';

/** An Agent is a user or machine that can write data to an Atomic Server. An Agent *might* not have subject, sometimes. */
export class Agent {
  privateKey: string;
  publicKey: string;
  subject?: string;

  constructor(privateKey: string, subject?: string) {
    if (subject) {
      tryValidURL(subject);
    }
    this.subject = subject;
    this.privateKey = privateKey;
    (async () => {
      const pubKey = await generatePublicKeyFromPrivate(privateKey);
      this.publicKey = pubKey;
    })();
  }

  /** Returns existing public key or generates one using the private key */
  async getPublicKey(): Promise<string> {
    if (!this.publicKey) {
      const pubKey = await generatePublicKeyFromPrivate(this.privateKey);
      this.publicKey = pubKey;
    }
    return this.publicKey;
  }
}

/** Parses a base64 JSON object containing a privateKey and subject. Throws when fails. */
export function parseSecret(secretB64: string): Agent {
  const agentBytes = atob(secretB64);
  const parsed = JSON.parse(agentBytes);
  const { privateKey, subject } = parsed;
  const agent = new Agent(privateKey, subject);
  return agent;
}
