import { Resource, properties } from '@tomic/lib';
import { useStore, useString } from '@tomic/react';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ContainerNarrow } from '../components/Containers';
import { ValueForm } from '../components/forms/ValueForm';
import { editURL, openURL } from '../helpers/navigation';
import AllProps from '../components/AllProps';
import { useSettings } from '../helpers/AppSettings';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';
import { paths } from '../routes/paths';

type DrivePageProps = {
  resource: Resource;
};

/** A View that redirects!. */
function RedirectPage({ resource }: DrivePageProps): JSX.Element {
  const [destination] = useString(resource, properties.redirect.destination);
  const [redirectAgent] = useString(
    resource,
    properties.redirect.redirectAgent,
  );
  const history = useHistory();
  const { agent, setAgent } = useSettings();
  const store = useStore();

  // This should probably be placed in a useEffect
  if (redirectAgent) {
    // If there is an agent without a Subject, that is because the Browser has just sent a query param to the invite resource, as part of the invite process
    if (agent && !agent.subject) {
      agent.subject = redirectAgent;
      toast.success(
        <div>
          <p>New User created!</p>
          <Button onClick={() => history.push(paths.agentSettings)}>
            User Settings
          </Button>
        </div>,
        { duration: 6000 },
      );
      setAgent(agent);
    }
  }

  if (destination) {
    // go to the destination, unless the user just hit the back button
    if (history.action != 'POP') {
      // Fetch that resource again
      store.fetchResource(destination, true);
      history.push(openURL(destination));
    }
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <ValueForm resource={resource} propertyURL={properties.description} />
      <h1>Redirect</h1>
      <p>
        This page should redirect you automatically (unless you have just
        pressed the back button)
      </p>
      <AllProps resource={resource} except={[properties.isA]} />
    </ContainerNarrow>
  );
}

export default RedirectPage;
