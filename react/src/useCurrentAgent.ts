import { useCallback, useEffect, useState } from 'react';
import { Agent } from '@tomic/lib';
import { useLocalStorage, useStore } from './index';

const AGENT_LOCAL_STORAGE_KEY = 'agent';

/**
 * A hook for using and adjusting the Agent. Persists the agent to LocalStorage.
 * CAUTION: Only use this hook once inside your app! The best place to use this,
 * is somewhere inside your synchronized application state. The value will not
 * update if the LocalStorage updates.
 */
export const useCurrentAgent = (): [Agent | null, (agent?: Agent) => void] => {
  // Localstorage for cross-session persistence of JSON object
  const [agentJSON, setAgentJSON] = useLocalStorage<Agent | null>(
    AGENT_LOCAL_STORAGE_KEY,
    null,
  );
  const store = useStore();
  // In memory representation of the full Agent
  const [stateAgent, setStateAgent] = useState<Agent>(store.getAgent());

  const handleSetAgent = useCallback(
    (agent: Agent | null) => {
      setAgentJSON(agent);
      setStateAgent(agent);
      // Also update the Agent inside the store
      store.setAgent(agent);

      return;
    },
    [store],
  );

  useEffect(() => {
    if (agentJSON && store.getAgent() === null && stateAgent === null) {
      handleSetAgent(agentJSON);
    }
  }, [agentJSON]);

  return [stateAgent, handleSetAgent];
};

/** Gets the Agent from local storage, if any. Useful when initializing app */
export function initAgentFromLocalStorage(): Agent | null {
  const lsItem = localStorage.getItem(AGENT_LOCAL_STORAGE_KEY);

  if (lsItem === null) {
    return null;
  }

  const agentJSON = JSON.parse(lsItem);
  const agent: Agent | null = agentJSON && Agent.fromJSON(agentJSON);

  return agent;
}
