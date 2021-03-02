import * as React from 'react';
import styled from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';

import { properties } from '../helpers/urls';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { useViewport } from '../helpers/useMedia';
import { useArray, useNumber, useResource, useString, useTitle } from '../atomic-react/hooks';
import { Resource } from '../atomic-lib/resource';
import { Button } from './Button';
import { ContainerFull } from './Containers';
import Markdown from './datatypes/Markdown';
import NewInstanceButton from './NewInstanceButton';
import ResourceCard from './ResourceCard';
import Table from './Table';
import { useSubjectParam } from '../helpers/useCurrentSubject';
import { DropDownList, DropDownMini } from './forms/Dropdownlist';

type CollectionProps = {
  resource: Resource;
};

enum DisplayStyle {
  TABLE,
  CARDLIST,
}

/** Returns the name for a displaystyle */
const displayStyleString = (style: DisplayStyle): string => {
  switch (style) {
    case DisplayStyle.CARDLIST: {
      return 'cards';
      break;
    }
    case DisplayStyle.TABLE: {
      return 'table';
    }
  }
};

/** A View for collections. Contains logic for switching between various views. */
function Collection({ resource }: CollectionProps): JSX.Element {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const viewportWidth = useViewport();
  // If a user is on a smaller screen, it's probably best to show a Cardlist
  const defaultView = viewportWidth < 700 ? DisplayStyle.CARDLIST : DisplayStyle.TABLE;
  const [displayStyle, setDisplayStyle] = useLocalStorage('CollectionDisplayStyle', defaultView);
  const [members] = useArray(resource, properties.collection.members);
  const [klass] = useString(resource, properties.collection.value);
  // const [pageSizeI] = useNumber(resource, properties.collection.pageSize);
  const [currentPage] = useNumber(resource, properties.collection.currentPage);
  const [totalPages] = useNumber(resource, properties.collection.totalPages);
  // Query parameters for Collections
  const [, setPage] = useSubjectParam('current_page');
  // We use the pageSize from the Collection itself - not the query param. This gives us a default value.
  // const [, setPageSize] = useSubjectParam('page_size');
  const [propertyFilter, setPropertyFilter] = useSubjectParam('property');
  const [valueFilter, setValueFilter] = useSubjectParam('value');
  const [sortBy, setSortBy] = useSubjectParam('sort_by');
  const [sortDesc, setSortDesc] = useSubjectParam('sort_desc');

  // We kind of assume here that all Collections will be filtered by an `is-a` prop and `Class` value.
  // But we can also have a collection of thing that share the same creator.
  // If that happens, we need a different approach to rendering the Headers
  const [classResource] = useResource(klass);
  const [requiredProps] = useArray(classResource, properties.requires);
  const [recommendedProps] = useArray(classResource, properties.recommends);
  const propsArrayFull = requiredProps.concat(recommendedProps);

  const handleToggleView = () => {
    setDisplayStyle(nextDisplayStyle());
  };

  function handlePrevPage() {
    if (currentPage !== 0) {
      () => setPage(currentPage - 1);
    }
  }

  function handleNextPage() {
    if (currentPage !== totalPages - 1) {
      () => setPage(currentPage + 1);
    }
  }

  function handleSetSort(by: string) {
    setSortBy(by);
  }

  const nextDisplayStyle = (): DisplayStyle => {
    switch (displayStyle) {
      case DisplayStyle.CARDLIST: {
        return DisplayStyle.TABLE;
      }
      case DisplayStyle.TABLE: {
        return DisplayStyle.CARDLIST;
      }
    }
  };
  useHotkeys('v', handleToggleView, {}, [displayStyle]);

  return (
    <ContainerFull about={resource.getSubject()}>
      <h1>{title}</h1>
      <Button subtle onClick={handleToggleView}>
        {displayStyleString(nextDisplayStyle())} view
      </Button>
      {klass && <NewInstanceButton klass={klass} />}
      {totalPages > 1 && (
        <>
          <Button subtle onClick={handlePrevPage} disabled={currentPage == 0}>
            prev page
          </Button>
          <Button subtle onClick={handleNextPage} disabled={currentPage == totalPages - 1}>
            next page
          </Button>
        </>
      )}
      <DropDownMini>
        <DropDownList placeholder={'sort by...'} initial={sortBy} options={propsArrayFull} onUpdate={handleSetSort} />
      </DropDownMini>
      {description && <Markdown text={description} />}
      {/* <input type='number' placeholder='page nr' value={page} onChange={e => setPage(e.target.value)} /> */}
      {/* <input type='number' placeholder='page size' value={pageSizeI} onChange={e => setPageSize(e.target.value)} /> */}
      {displayStyle == DisplayStyle.CARDLIST && <CardList members={members} />}
      {displayStyle == DisplayStyle.TABLE && <Table resource={resource} members={members} columns={propsArrayFull} />}
    </ContainerFull>
  );
}

type CardListProps = {
  members: string[];
};

function CardList({ members }: CardListProps): JSX.Element {
  return (
    <Masonry>
      {members.map(member => (
        <GridItem key={member}>
          <ResourceCard key={member} subject={member} />
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
  margin-bottom: ${props => props.theme.margin}rem;
  break-inside: avoid;
  word-break: break-word;
`;

/** A grid with columns and dynamic height items. Unfortunately, it does not work properly with safari, where shadows appear cropped */
const Masonry = styled.div`
  column-count: 1;
  column-gap: ${props => props.theme.margin}rem;
  margin: ${props => props.theme.margin}rem auto;
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
