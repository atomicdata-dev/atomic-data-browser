import React from 'react';
import { Resource } from '../atomic-lib/resource';
import PropVal from './PropVal';

type Props = {
  resource: Resource;
  /** A list of property subjects (URLs) that need not be rendererd */
  except?: string[];
};

/** Lists all PropVals for some resource. Optionally ignores a bunch of subjects */
function AllProps({ resource, except = [] }: Props): JSX.Element {
  return (
    <React.Fragment>
      {[...resource.getPropVals()].map(
        ([prop, val]): JSX.Element => {
          if (except.includes(prop)) {
            return null;
          }
          return <PropVal key={prop} propertyURL={prop} value={val} />;
        },
      )}
    </React.Fragment>
  );
}

export default AllProps;
