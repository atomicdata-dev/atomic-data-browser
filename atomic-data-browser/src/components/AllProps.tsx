import React from 'react';
import styled from 'styled-components';
import { Resource } from '@tomic/lib';
import PropVal from './PropVal';

type Props = {
  resource: Resource;
  /** A list of property subjects (URLs) that need not be rendererd */
  except?: string[];
};

const AllPropsWrapper = styled.div`
  margin-bottom: ${props => props.theme.margin}rem;
`;

/** Lists all PropVals for some resource. Optionally ignores a bunch of subjects */
function AllProps({ resource, except = [] }: Props): JSX.Element {
  return (
    <AllPropsWrapper>
      {[...resource.getPropVals()].map(
        // This is a place where you might want to use the _val, because of performance. However, we currently don't, because of the form renderer.
        ([prop, _val]): JSX.Element => {
          if (except.includes(prop)) {
            return null;
          }
          return <PropVal key={prop} propertyURL={prop} resource={resource} />;
        },
      )}
    </AllPropsWrapper>
  );
}

export default AllProps;
