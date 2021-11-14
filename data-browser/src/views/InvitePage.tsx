import * as React from 'react';
import { Resource, Agent, generateKeyPair, properties } from '@tomic/lib';
import {
  useBoolean,
  useNumber,
  useResource,
  useString,
  useTitle,
} from '@tomic/react';
import { useHistory } from 'react-router-dom';

import { ContainerNarrow } from '../components/Containers';
import { ValueForm } from '../components/forms/ValueForm';
import ResourceInline from './ResourceInline';
import { Button } from '../components/Button';
import { openURL } from '../helpers/navigation';
import { useSettings } from '../helpers/AppSettings';

type DrivePageProps = {
  resource: Resource;
};

/** A View that opens an invite */
function InvitePage({ resource }: DrivePageProps): JSX.Element {
  const [target] = useString(resource, properties.invite.target);
  const [usagesLeft] = useNumber(resource, properties.invite.usagesLeft);
  const [write] = useBoolean(resource, properties.invite.write);
  const history = useHistory();
  const { agent, setAgent } = useSettings();
  const agentResource = useResource(agent?.subject);
  const agentTitle = useTitle(agentResource, 15);

  const agentSubject = agent?.subject;

  if (agentSubject && usagesLeft && usagesLeft > 0) {
    // Accept the invite if an agent subject is present, but not if the user just pressed the back button
    if (history.action != 'POP') {
      handleAccept(null, agentSubject);
    }
  }

  // When the Invite is accepted, a new Agent might be created.
  // When this happens, a new keypair is made, but the subject of the Agent is not yet known.
  // It will be created by the server, and will be accessible in the Redirect response.
  async function handleNew() {
    const keypair = await generateKeyPair();
    const newAgent = new Agent(keypair.privateKey);
    setAgent(newAgent);
    const publicKey = await newAgent.getPublicKey();
    handleAccept(publicKey);
  }

  function handleAccept(publicKey?: string, agent?: string) {
    const inviteURL = new URL(resource.getSubject());

    if (publicKey) {
      inviteURL.searchParams.set('public-key', publicKey);
    } else {
      inviteURL.searchParams.set('agent', agent);
    }
    history.push(openURL(inviteURL.href));
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <h1>
        Invite to {write ? 'edit' : 'view'} <ResourceInline subject={target} />
      </h1>
      <ValueForm resource={resource} propertyURL={properties.description} />
      {usagesLeft == 0 ? (
        <em>Sorry, this Invite has no usages left. Ask for a new one.</em>
      ) : (
        <>
          {agentSubject ? (
            <>
              <Button
                data-test='accept-existing'
                onClick={() => handleAccept(null, agentSubject)}
              >
                Accept as {agentTitle}
              </Button>
            </>
          ) : (
            <Button data-test='accept-new' onClick={handleNew}>
              Accept as new user
            </Button>
          )}
          {!isNaN(usagesLeft) && <p>({usagesLeft} usages left)</p>}
        </>
      )}
    </ContainerNarrow>
  );
}

export default InvitePage;
