import React from 'react';
import { properties } from '../helpers/urls';
import { useArray, useString, useTitle } from '../atomic-react/hooks';
import Markdown from '../components/datatypes/Markdown';
import AtomicLink from '../components/Link';
import { CardInsideFull, CardRow } from '../components/Card';
import ResourceInline from '../components/ResourceInline';
import { CardViewProps } from '../components/ResourceCard';

/** Renders a Resource and all its Properties in a random order. Title (shortname) is rendered prominently at the top. */
function CollectionCard({ resource, small }: CardViewProps): JSX.Element {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const [members] = useArray(resource, properties.collection.members);

  return (
    <React.Fragment>
      <AtomicLink subject={resource.getSubject()}>
        <h2>{title}</h2>
      </AtomicLink>
      {description && <Markdown text={description} />}
      {!small && (
        <CardInsideFull>
          {members.map(member => {
            return (
              <CardRow key={member}>
                <ResourceInline subject={member} />
              </CardRow>
            );
          })}
        </CardInsideFull>
      )}
    </React.Fragment>
  );
}

export default CollectionCard;
