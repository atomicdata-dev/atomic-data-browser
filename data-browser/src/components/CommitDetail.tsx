import React from 'react';
import { useDate, useResource, useString } from '@tomic/react';
import { Resource, properties } from '@tomic/lib';
import ResourceInline from '../views/ResourceInline';
import { Detail } from './Detail';
import DateTime from './datatypes/DateTime';
import AtomicLink from './AtomicLink';

type Props = {
  commitSubject: string;
};

/** Shows the latest editor and edit date */
export function CommitDetail({ commitSubject }: Props): JSX.Element {
  const resource = useResource(commitSubject);
  const [signer] = useString(resource, properties.commit.signer);
  const createdAt = useDate(resource, properties.commit.createdAt);

  if (!commitSubject || !resource.isReady) {
    return null;
  }

  return (
    <React.Fragment>
      <Detail>
        <AtomicLink subject={commitSubject}>{'edited'}</AtomicLink>
        {' by '}
        <ResourceInline subject={signer} />{' '}
        {createdAt && <DateTime date={createdAt} />}
      </Detail>
    </React.Fragment>
  );
}
