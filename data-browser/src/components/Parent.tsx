import React from 'react';
import styled from 'styled-components';
import { useResource, useString, useTitle } from '@tomic/react';
import { properties, Resource } from '@tomic/lib';
import ResourceInline from '../views/ResourceInline';

type ParentProps = {
  resource: Resource;
};

/** Breadcrumb list. Recursively renders parents. */
function Parent({ resource }: ParentProps): JSX.Element {
  const [parent] = useString(resource, properties.parent);
  const title = useTitle(resource);

  return (
    <React.Fragment>
      {parent && (
        <List>
          <NestedParent subject={parent} />
          <Breadcrumb>{title}</Breadcrumb>
        </List>
      )}
    </React.Fragment>
  );
}

type NestedParentProps = {
  subject: string;
};

/** The actually recursive part */
function NestedParent({ subject }: NestedParentProps): JSX.Element {
  const resource = useResource(subject, { allowIncomplete: true });
  const [parent] = useString(resource, properties.parent);

  return (
    <>
      {parent && <NestedParent subject={parent} />}
      <Breadcrumb>
        <ResourceInline subject={subject} />
      </Breadcrumb>
      <Breadcrumb>{'/'}</Breadcrumb>
    </>
  );
}

const Breadcrumb = styled.div`
  margin-right: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: center;
`;

const List = styled.div`
  display: flex;
  direction: row;
`;

export default Parent;
