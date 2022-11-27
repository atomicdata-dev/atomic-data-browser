import { useCallback, useEffect, useState } from 'react';
import { Agent } from '@tomic/lib';
import { useLocalStorage, useStore } from './index.js';

const AGENT_LOCAL_STORAGE_KEY = 'agent';

/**
 * A hook for using and adjusting the Agent. Persists the agent to LocalStorage.
 * CAUTION: Only use this hook once inside your app! The best place to use this,
 * is somewhere inside your synchronized application state. The value will not
 * update if the LocalStorage updates.
 */
export const useCurrentAgent = (): [
  Agent | undefined,
  (agent?: Agent) => void,
] => {
  // Localstorage for cross-session persistence of JSON object
  const [agentJSON, setAgentJSON] = useLocalStorage<Agent | undefined>(
    AGENT_LOCAL_STORAGE_KEY,
    undefined,
  );
  const store = useStore();
  // In memory representation of the full Agent
  const [stateAgent, setStateAgent] = useState<Agent | undefined>(
    store.getAgent(),
  );

  const handleSetAgent = useCallback(
    (agent: Agent | undefined) => {
      setAgentJSON(agent);
      setStateAgent(agent);
      // Also update the Agent inside the store
      store.setAgent(agent);

      return;
    },
    [store],
  );

  useEffect(() => {
    if (
      agentJSON &&
      store.getAgent() === undefined &&
      stateAgent === undefined
    ) {
      handleSetAgent(agentJSON);
    }
  }, [agentJSON]);

  return [stateAgent, handleSetAgent];
};

/** Gets the Agent from local storage, if any. Useful when initializing app */
export function initAgentFromLocalStorage(): Agent | undefined {
  const lsItem = localStorage.getItem(AGENT_LOCAL_STORAGE_KEY);

  if (lsItem === null || lsItem === undefined) {
    return undefined;
  }

  try {
    const agentJSON = JSON.parse(lsItem);
    const agent: Agent | undefined = agentJSON && Agent.fromJSON(agentJSON);

    return agent;
  } catch (e) {
    console.error('Error parsing agent from local storage', e);

    return undefined;
  }
}
