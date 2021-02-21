import {checkValidURL} from "./client.js";
import {generatePublicKeyFromPrivate} from "./commit.js";
export class Agent {
  constructor(subject, privateKey) {
    checkValidURL(subject);
    this.subject = subject;
    this.privateKey = privateKey;
    async () => {
      const pubKey = await generatePublicKeyFromPrivate(privateKey);
      this.publicKey = pubKey;
    };
  }
}
