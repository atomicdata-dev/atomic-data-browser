import React from 'react';
import styled from 'styled-components';
import { Resource } from '../atomic-lib/resource';
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
        ([prop, val]): JSX.Element => {
          if (except.includes(prop)) {
            return null;
          }
          return <PropVal key={prop} propertyURL={prop} value={val} />;
        },
      )}
    </AllPropsWrapper>
  );
}

export default AllProps;
