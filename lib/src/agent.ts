import {
  fetchResource,
  generatePublicKeyFromPrivate,
  properties,
  tryValidURL,
} from './index';

/**
 * An Agent is a user or machine that can write data to an Atomic Server. An
 * Agent *might* not have subject, sometimes. https://atomicdata.dev/classes/Agent
 */
export class Agent implements AgentInterface {
  privateKey: string;
  publicKey?: string;
  subject?: string;

  constructor(privateKey: string, subject?: string) {
    if (subject) {
      tryValidURL(subject);
    }
    this.subject = subject;
    this.privateKey = privateKey;
  }

  /** Returns existing public key or generates one using the private key */
  async getPublicKey(): Promise<string> {
    if (!this.publicKey) {
      const pubKey = await generatePublicKeyFromPrivate(this.privateKey);
      this.publicKey = pubKey;
    }
    return this.publicKey;
  }

  /**
   * Returns a base64 encoded JSON object containing the Subject and the Private
   * Key. Used for signing in with one string
   */
  public buildSecret(): string {
    const objJsonStr = JSON.stringify(this);
    return btoa(objJsonStr);
  }

  /** Fetches the public key for the agent, checks if it matches with the current one */
  public async checkPublicKey(): Promise<void> {
    const resource = await fetchResource(this.subject);
    if (resource.error) {
      throw new Error(
        `Could not fetch agent, and could therefore not check validity of public key. ${resource.error}`,
      );
    }
    const fetchedPubKey = resource.get(properties.agent.publicKey).toString();
    if (fetchedPubKey !== (await this.getPublicKey())) {
      throw new Error(
        'Fetched publickey does not match current one - is the private key correct?',
      );
    }
  }

  /**
   * Parses a base64 JSON object containing a privateKey and subject, and
   * constructs an Agent from that.
   */
  static fromSecret(secretB64: string): Agent {
    const agentBytes = atob(secretB64);
    const parsed = JSON.parse(agentBytes);
    const { privateKey, subject } = parsed;
    const agent = new Agent(privateKey, subject);
    return agent;
  }

  /** Parses a JSON object containing a privateKey and an Agent subject */
  static fromJSON(obj: AgentInterface): Agent {
    return new Agent(obj.privateKey, obj.subject);
  }
}

/**
 * An Agent is a user or machine that can write data to an Atomic Server. An
 * Agent *might* not have subject, sometimes. https://atomicdata.dev/classes/Agent
 */
export interface AgentInterface {
  /** https://atomicdata.dev/properties/privateKey */
  privateKey: string;
  /** https://atomicdata.dev/properties/publicKey */
  publicKey?: string;
  /** URL of the Agent */
  subject?: string;
}
