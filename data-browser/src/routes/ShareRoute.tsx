import React, { useEffect, useState } from 'react';
import {
  useArray,
  useCanWrite,
  useResource,
  useStore,
  useTitle,
} from '@tomic/react';
import { ContainerNarrow } from '../components/Containers';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { Right, urls } from '@tomic/lib';
import ResourceInline from '../views/ResourceInline';
import { Card, CardInsideFull, CardRow } from '../components/Card';
import { FaGlobe } from 'react-icons/fa';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { InviteForm } from '../components/InviteForm';

/** Form for managing and viewing rights for this resource */
export function ShareRoute(): JSX.Element {
  const [subject] = useCurrentSubject();
  const resource = useResource(subject);
  const title = useTitle(resource);
  const store = useStore();
  const [canWrite] = useCanWrite(resource);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const [writers, setWriters] = useArray(resource, urls.properties.write);
  const [readers, setReaders] = useArray(resource, urls.properties.read);

  const [inheritedRights, setInheritedRights] = useState<Right[]>([]);

  useEffect(() => {
    async function getTheRights() {
      const allRights = await resource.getRights(store);
      const inherited = allRights.filter(r => r.setIn !== subject);

      // Make sure the public agent is always the top of the list
      const sorted = inherited.sort((a, _b) => {
        return a.for === urls.instances.publicAgent ? -1 : 1;
      });

      setInheritedRights(sorted);
    }

    getTheRights();
  }, [resource]);

  function handleSetRight(
    agent: string,
    write: boolean,
    setToTrue: boolean,
  ): void {
    let agents = write ? writers : readers;
    if (setToTrue) {
      // remove previous occurence
      agents = agents.filter(s => s !== agent);
      agents.push(agent);
    } else {
      agents = agents.filter(s => s !== agent);
    }
    if (write) {
      setWriters(agents);
    } else {
      setReaders(agents);
    }
  }

  function constructAgentProps(): AgentRight[] {
    const rightsMap: Map<string, RightBools> = new Map();

    // Always show the public agent
    rightsMap.set(urls.instances.publicAgent, { read: false, write: false });

    readers.map(agent => {
      rightsMap.set(agent, {
        read: true,
        write: false,
      });
    });

    writers.map(agent => {
      const old = rightsMap.get(agent);
      rightsMap.set(agent, {
        read: old ? old.read : false,
        write: true,
      });
    });

    const rights: AgentRight[] = [];

    rightsMap.forEach((right, agent) => {
      rights.push({
        agentSubject: agent,
        read: right.read,
        write: right.write,
      });
    });

    // Make sure the public agent is always the top of the list
    const sorted = rights.sort(a => {
      return a.agentSubject === urls.instances.publicAgent ? -1 : 1;
    });

    return sorted;
  }

  return (
    <ContainerNarrow>
      <h1>
        <code>share settings for</code> {title}
      </h1>
      {canWrite && !showInviteForm && (
        <Button onClick={() => setShowInviteForm(true)}>Send Invite...</Button>
      )}
      {showInviteForm && <InviteForm target={resource} />}
      <Card>
        <RightsHeader text='rights set here:' />
        <CardInsideFull>
          {/* This key might be a bit too much, but the component wasn't properly re-rendering before */}
          {constructAgentProps().map(right => (
            <AgentRights
              key={JSON.stringify(right)}
              {...right}
              handleSetRight={canWrite && handleSetRight}
            />
          ))}
        </CardInsideFull>
      </Card>
      {canWrite && (
        <Button
          disabled={!resource.getCommitBuilder().hasUnsavedChanges()}
          onClick={() => resource.save(store)}
        >
          Save
        </Button>
      )}
      {inheritedRights.length > 0 && (
        <Card>
          <RightsHeader text='inherited rights:' />
          <CardInsideFull>
            {inheritedRights.map(right => (
              <AgentRights
                inheritedFrom={right.setIn}
                key={right.for + right.type}
                read={right.type == 'read'}
                write={right.type == 'write'}
                agentSubject={right.for}
              />
            ))}
          </CardInsideFull>
        </Card>
      )}
    </ContainerNarrow>
  );
}

interface RightBools {
  read: boolean;
  write: boolean;
}

interface AgentRight extends RightBools {
  agentSubject: string;
}

interface AgentRightsProps extends AgentRight {
  inheritedFrom?: string;
  handleSetRight?: (agent: string, write: boolean, setToTrue: boolean) => void;
}

function AgentRights(props: AgentRightsProps): JSX.Element {
  return (
    <CardRow>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {props.agentSubject === urls.instances.publicAgent ? (
            <>
              <FaGlobe /> Public (anyone){' '}
            </>
          ) : (
            <ResourceInline subject={props.agentSubject} />
          )}
          {props.inheritedFrom && (
            <>
              {' (via '}
              <ResourceInline subject={props.inheritedFrom} />
              {') '}
            </>
          )}
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <StyledCheckbox
            type='checkbox'
            disabled={!props.handleSetRight}
            onChange={e =>
              props.handleSetRight(props.agentSubject, false, e.target.checked)
            }
            checked={props.read}
            title={
              props.read
                ? 'Read access. Toggle to remove access.'
                : 'No read access. Toggle to give read access.'
            }
          />
          <StyledCheckbox
            type='checkbox'
            disabled={!props.handleSetRight}
            onChange={e =>
              props.handleSetRight(props.agentSubject, true, e.target.checked)
            }
            checked={props.write}
            title={
              props.write
                ? 'Write access. Toggle to remove access.'
                : 'No write access. Toggle to give write access.'
            }
          />
        </div>
      </div>
    </CardRow>
  );
}

const StyledCheckbox = styled.input`
  width: 2rem;
`;

function RightsHeader({ text }: { text: string }): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        marginBottom: '1rem',
      }}
    >
      <div style={{ flex: 1, fontWeight: 'bold' }}>{text}</div>
      <div style={{ alignSelf: 'flex-end', justifyContent: 'center' }}>
        <span>read </span>
        <span>write</span>
      </div>
    </div>
  );
}
