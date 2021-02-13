import { checkValidURL } from './client';
import { generatePublicKeyFromPrivate } from './commit';

/** An Agent is a user or machine that can write data to an Atomic Server */
export class Agent {
  privateKey: string;
  publicKey: string;
  subject: string;

  constructor(subject: string, privateKey: string) {
    checkValidURL(subject);
    this.subject = subject;
    this.privateKey = privateKey;
    async () => {
      const pubKey = await generatePublicKeyFromPrivate(privateKey);
      this.publicKey = pubKey;
    };
  }
}
