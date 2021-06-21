import React from 'react';
import styled from 'styled-components';
import { useString } from '@tomic/react';
import { Resource, properties } from '@tomic/lib';
import ResourceInline from './ResourceInline';

type Props = {
  resource: Resource;
};

/** Renders the is-a Class for some resource */
function ClassDetail({ resource }: Props): JSX.Element {
  const [klass] = useString(resource, properties.isA);

  return (
    <React.Fragment>
      {klass && (
        <ClassDetailStyled>
          {'is a '}
          <ResourceInline subject={klass} />
        </ClassDetailStyled>
      )}
    </React.Fragment>
  );
}

const ClassDetailStyled = styled.div`
  margin-bottom: 0.5rem;
  margin-top: -0.5rem;
  font-style: italic;
`;

export default ClassDetail;
