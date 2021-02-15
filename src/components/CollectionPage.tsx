import * as React from 'react';
import styled from 'styled-components';
import { useHotkeys } from 'react-hotkeys-hook';

import { properties } from '../helpers/urls';
import { useLocalStorage } from '../helpers/useLocalStorage';
import { useViewport } from '../helpers/useMedia';
import { useArray, useString, useTitle } from '../atomic-react/hooks';
import { Resource } from '../atomic-lib/resource';
import { ButtonMargin } from './Button';
import { ContainerFull } from './Containers';
import Markdown from './datatypes/Markdown';
import NewInstanceButton from './NewInstanceButton';
import ResourceCard from './ResourceCard';
import Table from './Table';

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
  // const [displayStyle, setDisplayStyle] = useState(defaultView);
  const [displayStyle, setDisplayStyle] = useLocalStorage('CollectionDisplayStyle', defaultView);
  const [members] = useArray(resource, properties.collection.members);
  const [klass] = useString(resource, properties.collection.value);

  const handleToggleView = () => {
    setDisplayStyle(nextDisplayStyle());
  };

  const nextDisplayStyle = (): DisplayStyle => {
    switch (displayStyle) {
      case DisplayStyle.CARDLIST: {
        return DisplayStyle.TABLE;
        break;
      }
      case DisplayStyle.TABLE: {
        return DisplayStyle.CARDLIST;
      }
    }
  };
  useHotkeys('v', () => handleToggleView(), {}, [displayStyle]);

  return (
    <ContainerFull about={resource.getSubject()}>
      <h1>{title}</h1>
      <ButtonMargin onClick={handleToggleView}>{displayStyleString(nextDisplayStyle())} view</ButtonMargin>
      {klass && <NewInstanceButton klass={klass} />}
      {description && <Markdown text={description} />}
      {displayStyle == DisplayStyle.CARDLIST && <CardList members={members} />}
      {displayStyle == DisplayStyle.TABLE && <Table resource={resource} members={members} />}
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
  display: grid;
  grid-template-rows: 1fr auto;
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

  /* Masonry on small screens */
  @media only screen and (min-width: 700px) {
    column-count: 2;
  }
  /* Masonry on medium-sized screens */
  @media only screen and (min-width: 1200px) {
    column-count: 3;
  }
  /* Masonry on large screens */
  @media only screen and (min-width: 1800px) {
    column-count: 4;
  }
`;

export default Collection;
