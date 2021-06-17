import React from 'react';
import styled from 'styled-components';
import { properties } from '../helpers/urls';
import { useString, useTitle } from '../../atomic-react/hooks';
import { Resource } from '../../atomic-lib/resource';
import ResourceInline from './ResourceInline';

type Props = {
  resource: Resource;
};

/** Breadcrumb list. Recursive. */
function Parent({ resource }: Props): JSX.Element {
  const [parent] = useString(resource, properties.parent);
  const title = useTitle(resource);

  return (
    <React.Fragment>
      {parent && (
        <List>
          <Breadcrumb>
            <ResourceInline subject={parent} />
          </Breadcrumb>
          <Breadcrumb>{'/'}</Breadcrumb>
          <Breadcrumb>{title}</Breadcrumb>
        </List>
      )}
    </React.Fragment>
  );
}

const Breadcrumb = styled.div`
  margin-right: 1rem;
`;

const List = styled.div`
  display: flex;
  direction: row;
`;

export default Parent;
