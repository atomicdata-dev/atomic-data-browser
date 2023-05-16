import React, { useEffect } from 'react';
import {
  useString,
  useResource,
  properties,
  Resource,
  urls,
} from '@tomic/react';

import { ContainerNarrow } from '../components/Containers';
import Collection from '../views/CollectionPage';
import EndpointPage from './EndpointPage';
import DrivePage from './DrivePage';
import RedirectPage from './RedirectPage';
import InvitePage from './InvitePage';
import { DocumentPage } from './DocumentPage';
import ErrorPage, { ErrorBoundary } from './ErrorPage';
import { ClassPage } from './ClassPage';
import { FilePage } from './File/FilePage';
import { ResourcePageDefault } from './ResourcePageDefault';
import { Spinner } from '../components/Spinner';
import { ChatRoomPage } from './ChatRoomPage';
import { MessagePage } from './MessagePage';
import { BookmarkPage } from './BookmarkPage/BookmarkPage';
import { ImporterPage } from './ImporterPage.jsx';
import Parent, { PARENT_PADDING_BLOCK } from '../components/Parent';
import styled from 'styled-components';
import { FolderPage } from './FolderPage';
import { ArticlePage } from './Article';
import { ViewTransitionProps } from '../helpers/ViewTransitionProps';
import { transitionName } from '../helpers/transitionName';
import { TablePage } from './TablePage';

/** These properties are passed to every View at Page level */
export type ResourcePageProps = {
  resource: Resource;
};

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

  // The body can have an inert attribute when the user navigated from an open dialog.
  // we remove it to make the page becomes interavtive again.
  useEffect(() => {
    document.body.removeAttribute('inert');
  }, []);

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

  const ReturnComponent = selectComponent(klass!);

  return (
    <>
      <Parent resource={resource} />
      <Main subject={subject}>
        <ErrorBoundary>
          <ReturnComponent resource={resource} />
        </ErrorBoundary>
      </Main>
    </>
  );
}

const Main = React.memo(styled.main<ViewTransitionProps>`
  /* Makes the contents fit the entire page */
  height: calc(
    100% - (${p => p.theme.heights.breadCrumbBar} + ${PARENT_PADDING_BLOCK} * 2)
  );
  ${p => transitionName('resource-page', p.subject)}
`);

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
    case urls.classes.chatRoom:
      return ChatRoomPage;
    case urls.classes.message:
      return MessagePage;
    case urls.classes.bookmark:
      return BookmarkPage;
    case urls.classes.importer:
      return ImporterPage;
    case urls.classes.folder:
      return FolderPage;
    case urls.classes.article:
      return ArticlePage;
    case urls.classes.table:
      return TablePage;
    default:
      return ResourcePageDefault;
  }
}

export default ResourcePage;
