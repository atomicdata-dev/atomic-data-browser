import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { properties } from '../helpers/urls';
import { useViewport } from '../helpers/useMedia';
import { useArray, useString, useTitle } from '../lib/react';
import { Resource } from '../lib/resource';
import { ButtonMargin } from './Button';
import Markdown from './datatypes/Markdown';
import ResourceCard from './ResourceCard';
import Table from './Table';

type CollectionProps = {
  resource: Resource;
};

enum DisplayStyle {
  TABLE,
  CARDLIST,
}

/** A View for collections. Contains logic for switching between various views. */
function Collection({ resource }: CollectionProps): JSX.Element {
  const title = useTitle(resource);
  const description = useString(resource, properties.description);
  const viewportWidth = useViewport();
  // If a user is on a smaller screen, it's probably best to show a Cardlist
  const defaultView = viewportWidth < 700 ? DisplayStyle.CARDLIST : DisplayStyle.TABLE;
  const [displayStyle, setDisplayStyle] = useState(defaultView);
  const members = useArray(resource, properties.collection.members);

  const handleToggleView = () => {
    switch (displayStyle) {
      case DisplayStyle.CARDLIST: {
        setDisplayStyle(DisplayStyle.TABLE);
        break;
      }
      case DisplayStyle.TABLE: {
        setDisplayStyle(DisplayStyle.CARDLIST);
      }
    }
  };

  return (
    <Wrapper>
      <h1>{title}</h1>
      <ButtonMargin onClick={handleToggleView}>Toggle view</ButtonMargin>
      {description && <Markdown text={description} />}
      {displayStyle == DisplayStyle.CARDLIST && <CardList members={members} />}
      {displayStyle == DisplayStyle.TABLE && <Table resource={resource} members={members} />}
    </Wrapper>
  );
}

type CardListProps = {
  members: string[];
};

function CardList({ members }: CardListProps): JSX.Element {
  return (
    <React.Fragment>
      {members.map(member => (
        <ResourceCard key={member} subject={member} />
      ))}
    </React.Fragment>
  );
}

export default Collection;

const Wrapper = styled.div`
  padding: 1rem;
`;
