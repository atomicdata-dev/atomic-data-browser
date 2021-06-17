import * as React from 'react';
import { Resource } from '../../../atomic-lib/resource';
import { ContainerNarrow } from '../components/Containers';
import { properties } from '../helpers/urls';
import { ValueForm } from '../components/forms/ValueForm';
import { useString } from '../../../atomic-react/hooks';
import { openURL } from '../helpers/navigation';
import { useHistory } from 'react-router-dom';
import AllProps from '../components/AllProps';
import { useSettings } from '../helpers/AppSettings';

type DrivePageProps = {
  resource: Resource;
};

/** A View that redirects!. */
function RedirectPage({ resource }: DrivePageProps): JSX.Element {
  const [destination] = useString(resource, properties.redirect.destination);
  const [redirectAgent] = useString(resource, properties.redirect.redirectAgent);
  const history = useHistory();
  const { agent, setAgent } = useSettings();

  if (redirectAgent) {
    // If there is an agent without a Subject, that is because the Browser has just sent a query param to the invite resource, as part of the invite process
    if (agent && !agent.subject) {
      agent.subject = redirectAgent;
      setAgent(agent);
    }
  }

  if (destination) {
    // go to the destination, unless the user just hit the back button
    if (history.action != 'POP') {
      history.push(openURL(destination));
    }
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <ValueForm resource={resource} propertyURL={properties.description} />
      <h1>Redirect</h1>
      <p>This page should redirect you automatically (unless you have just pressed the back button)</p>
      <AllProps resource={resource} />
    </ContainerNarrow>
  );
}

export default RedirectPage;
