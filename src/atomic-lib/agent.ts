import { generatePublicKeyFromPrivate } from './commit';

/** An Agent is a user or machine that can write data to an Atomic Server */
export class Agent {
  privateKey: string;
  publicKey: string;
  subject: string;

  constructor(subject: string, privateKey: string) {
    this.privateKey = privateKey;
    generatePublicKeyFromPrivate(privateKey).then(pubKey => (this.publicKey = pubKey));
    this.subject = subject;
  }
}
