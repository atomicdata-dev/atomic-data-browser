import React from 'react';
import AtomicUrl from './AtomicUrl';

type Props = {
  array: string[];
};

/** Renders a markdown value */
function ResourceArray({ array }: Props): JSX.Element {
  return (
    <div>
      {array.map(url => {
        return (
          <React.Fragment key={url}>
            <AtomicUrl url={url} />
            {', '}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ResourceArray;
