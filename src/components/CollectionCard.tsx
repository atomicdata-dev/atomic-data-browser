import React from 'react';
import { properties } from '../helpers/urls';
import { useArray, useString, useTitle } from '../atomic-react/hooks';
import { Resource } from '../atomic-lib/resource';
import Markdown from './datatypes/Markdown';
import Link from './Link';
import { Card, CardInsideFull, CardRow } from './Card';
import ResourceInline from './datatypes/ResourceInline';

type Props = {
  resource: Resource;
};

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function CollectionCard({ resource }: Props): JSX.Element {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [members] = useArray(resource, properties.collection.members);

  return (
    <Card>
      <Link url={resource.getSubject()}>
        <h2>{title}</h2>
      </Link>
      {description && <Markdown text={description} />}
      <CardInsideFull>
        {members.map(member => {
          return (
            <CardRow key={member}>
              <ResourceInline url={member} />
            </CardRow>
          );
        })}
      </CardInsideFull>
    </Card>
  );
}

export default CollectionCard;
