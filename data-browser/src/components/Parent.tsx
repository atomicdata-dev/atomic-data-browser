import React from 'react';
import styled from 'styled-components';
import {
  useResource,
  useString,
  useTitle,
  properties,
  Resource,
} from '@tomic/react';
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
          <NestedParent subject={parent} depth={0} />
          <Breadcrumb>{title}</Breadcrumb>
        </List>
      )}
    </React.Fragment>
  );
}

type NestedParentProps = {
  subject: string;
  depth: number;
};

/** The actually recursive part */
function NestedParent({ subject, depth }: NestedParentProps): JSX.Element {
  const resource = useResource(subject, { allowIncomplete: true });
  const [parent] = useString(resource, properties.parent);

  depth = depth + 1;

  // Prevent infinite recursion, set a limit to parent breadcrumbs
  if (depth > 5) {
    return <Breadcrumb>...</Breadcrumb>;
  }

  return (
    <>
      {parent && <NestedParent subject={parent} depth={depth} />}
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
