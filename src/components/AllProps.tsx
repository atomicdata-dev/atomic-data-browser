import React from 'react';
import { Resource } from '../lib/resource';
import PropVal from './PropVal';

type Props = {
  resource: Resource;
  /** A list of URLs that need not be rendererd */
  except?: string[];
};

function AllProps({ resource, except = [] }: Props): JSX.Element {
  return (
    <React.Fragment>
      {[...resource.getPropVals()].map(
        (propval): JSX.Element => {
          const propertyURL = propval[0];
          if (except.includes(propertyURL)) {
            return;
          }
          return <PropVal key={propertyURL} propertyURL={propertyURL} value={propval[1]} />;
        },
      )}
    </React.Fragment>
  );
}

export default AllProps;
