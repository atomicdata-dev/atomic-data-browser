import { useEffect, useState } from 'react';
import { Agent } from '@tomic/lib';
import { useStore } from './hooks';
import { useLocalStorage } from './useLocalStorage';

/**
 * A hook for using and adjusting the Agent. Persists the agent to LocalStorage.
 * Only use this hook once inside your app! The best place to use this, is
 * somewhere inside your synchronized application state
 */
export const useCurrentAgent = (): [Agent | null, (agent?: Agent) => void] => {
  // Localstorage for cross-session persistence of JSON object
  const [agentJSON, setAgentJSON] = useLocalStorage<Agent | null>(
    'agent',
    null,
  );
  // In memory representation of the full Agent
  const [agent, setAgent] = useState<Agent>(null);
  // Also update the Agent inside the store
  const store = useStore();

  // Set the initial agent, is set using Store
  useEffect(() => {
    if (agent == undefined) {
      setAgent(store.getAgent());
    }
  }, []);

  // When the localStorage JSON agent is updated, also update the in-memory agent
  useEffect(() => {
    if (agentJSON == null) {
      setAgent(null);
      return;
    }
    setAgent(Agent.fromJSON(agentJSON));
  }, [agentJSON]);

  // ... and when the in memory agent is updated, update the store agent
  useEffect(() => {
    store.setAgent(agent);
  }, [agent]);

  return [agent, setAgentJSON];
};
