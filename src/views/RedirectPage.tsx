import * as React from 'react';
import { Resource } from '../atomic-lib/resource';
import { ContainerNarrow } from '../components/Containers';
import { properties } from '../helpers/urls';
import { ValueForm } from '../components/forms/ValueForm';
import { useStore, useString } from '../atomic-react/hooks';
import { openURL } from '../helpers/navigation';
import { useHistory } from 'react-router-dom';
import { ErrorLook } from '../components/ResourceInline';

type DrivePageProps = {
  resource: Resource;
};

/** A View that redirects!. */
function RedirectPage({ resource }: DrivePageProps): JSX.Element {
  const [destination] = useString(resource, properties.redirect.destination);
  const [redirectAgent] = useString(resource, properties.redirect.redirectAgent);
  const history = useHistory();
  const store = useStore();

  if (redirectAgent) {
    // If there is an agent without a Subject, that is because the Browser has just sent a query param to the invite resource, as part of the invite process
    const foundAgent = store.getAgent();
    if (foundAgent && !foundAgent.subject) {
      foundAgent.subject = redirectAgent;
      store.setAgent(foundAgent);
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
      <ErrorLook>If this remains visible, the redirect is not working properly.</ErrorLook>
      <a href={destination}>to</a>
      <a href={redirectAgent}>redirect Agent</a>
    </ContainerNarrow>
  );
}

export default RedirectPage;
