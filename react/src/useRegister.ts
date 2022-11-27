import { useCallback } from 'react';
import { Agent, generateKeyPair, properties, useStore } from '.';

/** Only allows lowercase chars and numbers  */
export const nameRegex = '^[a-z0-9_-]+';

interface RegisterResult {
  agent: Agent;
  driveURL: string;
}

// Allow users to register and create a drive on the `/register` route.
export function useRegister(): (
  userName: string,
  email: string,
) => Promise<RegisterResult> {
  const store = useStore();

  const register = useCallback(
    /** Returns redirect URL of new drie on success */
    async (name: string, email: string): Promise<RegisterResult> => {
      const keypair = await generateKeyPair();
      const newAgent = new Agent(keypair.privateKey);
      const publicKey = await newAgent.getPublicKey();
      const url = new URL('/register', store.getServerUrl());
      url.searchParams.set('name', name);
      url.searchParams.set('public-key', publicKey);
      url.searchParams.set('email', email);
      const resource = await store.getResourceAsync(url.toString());
      const destination = resource.get(
        properties.redirect.destination,
      ) as string;
      const agentSubject = resource.get(
        properties.redirect.redirectAgent,
      ) as string;

      if (resource.error) {
        throw resource.error;
      }

      if (!destination) {
        throw new Error('No redirect destination');
      }

      if (!agentSubject) {
        throw new Error('No agent returned');
      }

      newAgent.subject = agentSubject;

      store.setAgent(newAgent);

      return { driveURL: destination, agent: newAgent };
    },
    [],
  );

  return register;
}
