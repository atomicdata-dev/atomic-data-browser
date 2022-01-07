import { useTitle } from '@tomic/react';
import React from 'react';

import AtomicLink from '../components/AtomicLink';
import { CardViewProps } from './ResourceCard';
import { FileInner } from './FilePage';

function FileCard({ resource }: CardViewProps): JSX.Element {
  const title = useTitle(resource);

  return (
    <React.Fragment>
      <AtomicLink subject={resource.getSubject()}>
        <h2>{title}</h2>
      </AtomicLink>
      <FileInner resource={resource} />
    </React.Fragment>
  );
}

export default FileCard;
