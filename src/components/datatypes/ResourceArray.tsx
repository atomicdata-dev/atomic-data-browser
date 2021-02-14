import React from 'react';
import ResourceInline from './ResourceInline';

type Props = {
  subjects: string[];
};

/** Renders an array of subject URLs as links with commas between them */
function ResourceArray({ subjects }: Props): JSX.Element {
  return (
    <>
      {subjects.map((url, index) => {
        return (
          <React.Fragment key={url}>
            <ResourceInline url={url} />
            {index !== subjects.length - 1 && ', '}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default ResourceArray;
