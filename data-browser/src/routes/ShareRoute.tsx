import React from 'react';
import { useArray, useResource, useStore, useTitle } from '@tomic/react';
import { ContainerNarrow } from '../components/Containers';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { urls } from '@tomic/lib';
import ResourceInline from '../views/ResourceInline';
import { Card, CardInsideFull, CardRow } from '../components/Card';
import { FaGlobe } from 'react-icons/fa';
import styled from 'styled-components';
import { Button } from '../components/Button';

/** Form for managing and viewing rights for this resource */
export function ShareRoute(): JSX.Element {
  const [subject] = useCurrentSubject();
  const resource = useResource(subject);
  const title = useTitle(resource);
  const store = useStore();

  const [writers, setWriters] = useArray(resource, urls.properties.write);
  const [readers, setReaders] = useArray(resource, urls.properties.read);

  function handleSetRight(agent: string, write: boolean, setToTrue: boolean): void {
    let agents = write ? writers : readers;
    console.log('handleSetRight agents', agents, write, setToTrue);
    if (setToTrue) {
      // remove previous occurence
      agents = agents.filter(s => s !== agent);
      agents.push(agent);
    } else {
      console.log('setting to false', agents)
      agents = agents.filter(s => s !== agent);
      console.log('new agents', agents)
    }
    if (write) {
      console.log('setWriters', agents);
      setWriters(agents);
    } else {
      console.log('setReaders', agents);
      setReaders(agents);
    }
  }

  function constructAgentProps(): AgentProps[] {
    const rightsMap: Map<string, Right> = new Map;

    // Always show the public agent
    rightsMap.set(urls.instances.publicAgent, { read: false, write: false });

    readers.map(agent => {
      rightsMap.set(agent, {
        read: true,
        write: false,
      });
    })

    writers.map(agent => {
      let old = rightsMap.get(agent);
      rightsMap.set(agent, {
        read: old ? old.read : false,
        write: true,
      });
    })

    let rights = []

    rightsMap.forEach((right, agent) => {
      rights.push({
        subject: agent,
        read: right.read,
        write: right.write,
      })
    })

    // Make sure the public agent is always the top of the list
    let sorted = rights.sort((a, b) => {
      return a.subject === urls.instances.publicAgent ? -1 : (a.subject > b.subject ? 1 : -1);
    })

    return sorted;
  }

  console.log('read', readers, 'write', writers);

  return (
    <ContainerNarrow>
      <h1><code>share settings for</code> {title}</h1>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>rights set here</div>
          <div style={{ alignSelf: 'flex-end', justifyContent: 'center' }}>
            <span>read </span>
            <span>write</span>
          </div>
        </div>
        <CardInsideFull>
          {/* This key might be a bit too much, but the component wasn't properly re-rendering before */}
          {constructAgentProps().map(right => <AgentRights key={JSON.stringify(right)} {...right} handleSetRight={handleSetRight} />)}
        </CardInsideFull>
      </Card>
      <Button onClick={() => resource.save(store)}>Save</Button>
    </ContainerNarrow>
  );
}

interface Right {
  read: boolean;
  write: boolean;
}

interface AgentProps extends Right {
  subject: string;
}

interface AgentRightsProps extends AgentProps {
  handleSetRight: (agent: string, write: boolean, setToTrue: boolean) => void;
}

function AgentRights(props: AgentRightsProps): JSX.Element {
  return <CardRow>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {props.subject === urls.instances.publicAgent ?
          <><FaGlobe /> Public (anyone) </> :
          <ResourceInline subject={props.subject} />
        }
      </div>
      <div style={{ alignSelf: 'flex-end' }}>
        <StyledCheckbox
          type="checkbox"
          onChange={e => props.handleSetRight(props.subject, false, e.target.checked)}
          checked={props.read}
          title={props.read ? "Read access. Toggle to remove access." : "No read access. Toggle to give read access."}
        />
        <StyledCheckbox
          type="checkbox"
          onChange={e => props.handleSetRight(props.subject, true, e.target.checked)}
          checked={props.write}
          title={props.write ? "Write access. Toggle to remove access." : "No write access. Toggle to give write access."}
        />
      </div>
    </div>
  </CardRow>;
}

let StyledCheckbox = styled.input`
  width: 2rem;
`;
