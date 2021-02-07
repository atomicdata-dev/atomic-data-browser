import React from 'react';
import ResourceInline from './ResourceInline';

type Props = {
  array: string[];
};

/** Renders a markdown value */
function ResourceArray({ array }: Props): JSX.Element {
  return (
    <div>
      {array.map((url, index) => {
        return (
          <React.Fragment key={url}>
            <ResourceInline url={url} />
            {index !== array.length - 1 && ', '}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ResourceArray;
