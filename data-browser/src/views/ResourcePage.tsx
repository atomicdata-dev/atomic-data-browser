import React from 'react';
import { useString, useResource, useTitle } from '@tomic/react';
import { properties, urls } from '@tomic/lib';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import Collection from '../views/CollectionPage';
import ClassDetail from '../components/ClassDetail';
import NewInstanceButton from '../components/NewInstanceButton';
import EndpointPage from './EndpointPage';
import { ValueForm } from '../components/forms/ValueForm';
import Parent from '../components/Parent';
import DrivePage from './DrivePage';
import RedirectPage from './RedirectPage';
import InvitePage from './InvitePage';
import DocumentPage from './DocumentPage';
import ErrorPage from './ErrorPage';

type Props = {
  subject: string;
};

/** The properties that are shown in an alternative, custom way in default views */
export const defaulHiddenProps = [
  properties.shortname,
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
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  const [klass] = useString(resource, properties.isA);

  if (resource.loading) {
    return <ContainerNarrow>Loading...</ContainerNarrow>;
  }
  if (resource.error) {
    return <ErrorPage resource={resource} />;
  }

  // TODO: Make these registerable, so users can easily extend these
  switch (klass) {
    case urls.classes.collection:
      return <Collection resource={resource} />;
    case urls.classes.endpoint:
      return <EndpointPage resource={resource} />;
    case urls.classes.drive:
      return <DrivePage resource={resource} />;
    case urls.classes.redirect:
      return <RedirectPage resource={resource} />;
    case urls.classes.invite:
      return <InvitePage resource={resource} />;
    case urls.classes.document:
      return <DocumentPage resource={resource} />;
  }

  return (
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
      {/* Perhaps this should be an extendible runtime thing, where Classes have potential Actions. */}
      {klass == urls.classes.class && <NewInstanceButton klass={subject} />}
    </ContainerNarrow>
  );
}

export default ResourcePage;
