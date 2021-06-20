import * as React from 'react';
import styled from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';

import { properties } from '../../../lib/src/urls';
import { useViewport } from '../helpers/useMedia';
import { useArray, useNumber, useResource, useString, useTitle, useLocalStorage } from '@tomic/react';
import { Resource } from '@tomic/lib';
import { Button } from '../components/Button';
import { ContainerFull } from '../components/Containers';
import Markdown from '../components/datatypes/Markdown';
import NewInstanceButton from '../components/NewInstanceButton';
import ResourceCard from '../components/ResourceCard';
import Table from '../components/Table';
import { useSubjectParam } from '../helpers/useCurrentSubject';
import { DropdownInput, DropDownMini } from '../components/forms/DropdownInput';
import Parent from '../components/Parent';
import { FaArrowLeft, FaArrowRight, FaInfo, FaTable, FaThLarge } from 'react-icons/fa';
import Link from '../components/Link';

type CollectionProps = {
  resource: Resource;
};

const displayStyles = [
  {
    id: 'cards',
    icon: <FaThLarge />,
  },
  {
    id: 'table',
    icon: <FaTable />,
  },
];

/** A View for collections. Contains logic for switching between various views. */
function Collection({ resource }: CollectionProps): JSX.Element {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const viewportWidth = useViewport();
  // If a user is on a smaller screen, it's probably best to show a Cardlist
  const defaultView = viewportWidth < 700 ? 0 : 1;
  const [displayStyleIndex, setDisplayStyle] = useLocalStorage('CollectionDisplayStyle', defaultView);
  const [members] = useArray(resource, properties.collection.members);
  // TODO: this is not a correct assumption, as the value can be all sorts of non-classes!
  const [klass] = useString(resource, properties.collection.value);
  // We use the currentPage and totalpages from the Collection Resource itself - not the query param. This gives us a default value.
  const [currentPage] = useNumber(resource, properties.collection.currentPage);
  const [totalPages] = useNumber(resource, properties.collection.totalPages);
  // Query parameters for Collections
  const [, setPage] = useSubjectParam('current_page');
  const [sortBy, setSortBy] = useSubjectParam('sort_by');

  // We kind of assume here that all Collections will be filtered by an `is-a` prop and `Class` value.
  // But we can also have a collection of thing that share the same creator.
  // If that happens, we need a different approach to rendering the Headers
  const [classResource] = useResource(klass);
  const [requiredProps] = useArray(classResource, properties.requires);
  const [recommendedProps] = useArray(classResource, properties.recommends);
  const propsArrayFull = requiredProps.concat(recommendedProps);

  // Info about the current Class
  const [classDescription] = useString(classResource, properties.description);
  const [classTitle] = useString(classResource, properties.shortname);
  const [showClassDescription, setShowClassDescription] = React.useState(false);

  function handleToggleView() {
    setDisplayStyle(getNextDisplayStyleIndex());
  }

  function getNextDisplayStyleIndex() {
    let newIndex = displayStyleIndex + 1;
    if (newIndex >= displayStyles.length) {
      newIndex = 0;
    }
    return newIndex;
  }

  function handlePrevPage() {
    if (currentPage !== 0) {
      setPage(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage !== totalPages - 1) {
      setPage(currentPage + 1);
    }
  }

  function handleSetSort(by: string) {
    setSortBy(by);
  }

  const displayStyle = displayStyles[displayStyleIndex];
  const nextDisplayStyle = displayStyles[getNextDisplayStyleIndex()];

  useHotkeys('v', handleToggleView, {}, [displayStyleIndex]);
  useHotkeys('right', handleNextPage, {}, [currentPage]);
  useHotkeys('left', handlePrevPage, {}, [currentPage]);

  const Pagination = () => (
    <>
      <Button subtle onClick={handlePrevPage} title='previous page (left arrow)' disabled={currentPage == 0}>
        <FaArrowLeft />
      </Button>
      <Button subtle onClick={handleNextPage} title='next page (right arrow)' disabled={currentPage == totalPages - 1}>
        <FaArrowRight />
      </Button>
    </>
  );

  return (
    <ContainerFull about={resource.getSubject()}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      <ButtonsBar>
        {totalPages > 1 && <Pagination />}
        <Button subtle onClick={handleToggleView} title={`use ${nextDisplayStyle.id} view`}>
          {nextDisplayStyle.icon}
        </Button>
        {klass && <NewInstanceButton subtle icon klass={klass} />}
        {klass && (
          <Button
            subtle
            onClick={() => setShowClassDescription(!showClassDescription)}
            title={showClassDescription ? `Hide ${classTitle} info` : `Show ${classTitle} info`}
          >
            <FaInfo />
          </Button>
        )}
        <DropDownMini>
          <DropdownInput placeholder={'sort by...'} initial={sortBy} options={propsArrayFull} onUpdate={handleSetSort} />
        </DropDownMini>
      </ButtonsBar>
      {description && <Markdown text={description} />}
      {showClassDescription && klass && (
        <>
          <Link subject={klass}>
            <h3>{classTitle}</h3>
          </Link>
          <Markdown text={classDescription} />
        </>
      )}
      {members.length == 0 ? (
        klass ? (
          <NewInstanceButton klass={klass} parent={resource.getSubject()} />
        ) : (
          <>empty</>
        )
      ) : (
        <>
          {displayStyle.id == 'cards' && <CardList members={members} />}
          {displayStyle.id == 'table' && <Table resource={resource} members={members} columns={propsArrayFull} />}
        </>
      )}
      {totalPages > 1 && <Pagination />}
    </ContainerFull>
  );
}

type CardListProps = {
  members: string[];
};

function CardList({ members }: CardListProps): JSX.Element {
  if (members.length == 0) {
    return <p>This collection is empty</p>;
  }
  return (
    <Masonry>
      {members.map((member, index) => (
        <GridItem key={member}>
          <ResourceCard initialInView={index < 10} key={member} subject={member} />
        </GridItem>
      ))}
    </Masonry>
  );
}

/** Use this to wrap around items to make them fit in the grid */
const GridItem = styled.div`
  margin: 0;
  /* display: grid; */
  /* grid-template-rows: 1fr auto; */
  word-break: break-word;
  overflow: hidden; /* fix for Firefox */
  break-inside: avoid-column;
`;

const ButtonsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

/** A grid with columns and dynamic height items. Unfortunately, it does not work properly with safari, where shadows appear cropped */
const Masonry = styled.div`
  column-count: 1;
  column-gap: ${props => props.theme.margin}rem;
  overflow: visible;
  box-sizing: border-box;

  @supports (grid-template-rows: masonry) {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: masonry;
    /* grid-gap: ${props => props.theme.margin}rem; */
    grid-column-gap: ${props => props.theme.margin}rem;
  }

  /* Masonry on small screens */
  @media only screen and (min-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    column-count: 2;
  }
  /* Masonry on medium-sized screens */
  @media only screen and (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    column-count: 3;
  }
  /* Masonry on large screens */
  @media only screen and (min-width: 1800px) {
    grid-template-columns: repeat(4, 1fr);
    column-count: 4;
  }
`;

export default Collection;
