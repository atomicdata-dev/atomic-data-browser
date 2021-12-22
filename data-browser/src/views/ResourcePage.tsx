import React from 'react';
import { useString, useResource, useTitle } from '@tomic/react';
import { properties, urls } from '@tomic/lib';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import Collection from '../views/CollectionPage';
import ClassDetail from '../components/ClassDetail';
import EndpointPage from './EndpointPage';
import { ValueForm } from '../components/forms/ValueForm';
import Parent from '../components/Parent';
import DrivePage from './DrivePage';
import RedirectPage from './RedirectPage';
import InvitePage from './InvitePage';
import DocumentPage from './DocumentPage';
import ErrorPage from './ErrorPage';
import { ClassPage } from './ClassPage';
import { FilePage } from './FilePage';
import PaymentPage, { useMonetization } from '../components/PaymentPage';
import PaymentWrapper from '../components/PaymentPage';

type Props = {
  subject: string;
};

/** The properties that are shown in an alternative, custom way in default views */
export const defaulHiddenProps = [
  properties.shortname,
  properties.file.filename,
  properties.description,
  properties.isA,
  properties.name,
  properties.parent,
  properties.write,
  properties.read,
];

/**
 * Renders a Resource and all its Properties in a random order. Title
 * (shortname) is rendered prominently at the top. If the Resource has a
 * particular Class, it will render a different Component.
 */
function ResourcePage({ subject }: Props): JSX.Element {
  const resource = useResource(subject);
  const title = useTitle(resource);
  const [klass] = useString(resource, properties.isA);
  const [paymentPointer] = useString(resource, properties.paymentPointer);

  if (resource.loading) {
    return <ContainerNarrow>Loading...</ContainerNarrow>;
  }
  if (resource.error) {
    return <ErrorPage resource={resource} />;
  }

  let ReturnComponent = (
    <ContainerNarrow about={subject}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      <ClassDetail resource={resource} />
      <ValueForm resource={resource} propertyURL={properties.description} />
      <AllProps
        resource={resource}
        except={defaulHiddenProps}
        editable
        columns
      />
    </ContainerNarrow>
  );

  // TODO: Make these registerable, so users can easily extend these
  switch (klass) {
    case urls.classes.collection:
      ReturnComponent = <Collection resource={resource} />;
      break;
    case urls.classes.endpoint:
      ReturnComponent = <EndpointPage resource={resource} />;
      break;
    case urls.classes.drive:
      ReturnComponent = <DrivePage resource={resource} />;
      break;
    case urls.classes.redirect:
      ReturnComponent = <RedirectPage resource={resource} />;
      break;
    case urls.classes.invite:
      ReturnComponent = <InvitePage resource={resource} />;
      break;
    case urls.classes.document:
      ReturnComponent = <DocumentPage resource={resource} />;
      break;
    case urls.classes.class:
      ReturnComponent = <ClassPage resource={resource} />;
      break;
    case urls.classes.file:
      ReturnComponent = <FilePage resource={resource} />;
      break;
  }

  if (paymentPointer) {
    return (
      <PaymentWrapper resource={resource}>{ReturnComponent}</PaymentWrapper>
    );
  } else {
    return ReturnComponent;
  }
}

export default ResourcePage;
