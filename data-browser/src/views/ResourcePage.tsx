import React from 'react';
import { useString, useResource } from '@tomic/react';
import { properties, Resource, urls } from '@tomic/lib';
import { ContainerNarrow } from '../components/Containers';
import Collection from '../views/CollectionPage';
import EndpointPage from './EndpointPage';
import DrivePage from './DrivePage';
import RedirectPage from './RedirectPage';
import InvitePage from './InvitePage';
import DocumentPage from './DocumentPage';
import ErrorPage from './ErrorPage';
import { ClassPage } from './ClassPage';
import { FilePage } from './FilePage';
import WebMonetizationWrapper from '../components/WebMonetizationWrapper';
import { ResourcePageDefault } from './ResourcePageDefault';
import Spinner from '../components/Button';

type Props = {
  subject: string;
};

/**
 * Renders a Resource and all its Properties in a random order. Title
 * (shortname) is rendered prominently at the top. If the Resource has a
 * particular Class, it will render a different Component.
 */
function ResourcePage({ subject }: Props): JSX.Element {
  const resource = useResource(subject);
  const [klass] = useString(resource, properties.isA);
  const [paymentPointer] = useString(resource, properties.paymentPointer);

  if (resource.loading) {
    return (
      <ContainerNarrow>
        <p>Loading...</p>
        <Spinner />
      </ContainerNarrow>
    );
  }
  if (resource.error) {
    return <ErrorPage resource={resource} />;
  }

  const ReturnComponent = selectComponent(klass);

  if (paymentPointer) {
    return (
      <WebMonetizationWrapper resource={resource}>
        <ReturnComponent resource={resource} />
      </WebMonetizationWrapper>
    );
  } else {
    return <ReturnComponent resource={resource} />;
  }
}

/** There properties are passed to every View at Page level */
export type ResourcePageProps = {
  resource: Resource;
};

function selectComponent(klass: string) {
  switch (klass) {
    case urls.classes.collection:
      return Collection;
    case urls.classes.endpoint:
      return EndpointPage;
    case urls.classes.drive:
      return DrivePage;
    case urls.classes.redirect:
      return RedirectPage;
    case urls.classes.invite:
      return InvitePage;
    case urls.classes.document:
      return DocumentPage;
    case urls.classes.class:
      return ClassPage;
    case urls.classes.file:
      return FilePage;
    default:
      return ResourcePageDefault;
  }
}

export default ResourcePage;
