import React from 'react';
import { useResource } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import AtomicLink from '../components/Link';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import Parent from '../components/Parent';
import { PropValRow, PropertyLabel } from '../components/PropVal';

/** Renders the data of some Resource */
function Data(): JSX.Element {
  const [subject] = useCurrentSubject();
  const [resource] = useResource(subject);
  const status = resource.getStatus();

  if (status == ResourceStatus.loading) {
    return <ContainerNarrow>Loading...</ContainerNarrow>;
  }
  if (status == ResourceStatus.error) {
    return <ContainerNarrow>{resource.getError().message}</ContainerNarrow>;
  }

  return (
    <ContainerNarrow about={subject}>
      <Parent resource={resource} />
      <h1>data view</h1>
      <PropValRow>
        <PropertyLabel>subject:</PropertyLabel>
        <AtomicLink url={subject}>{subject}</AtomicLink>
      </PropValRow>
      <AllProps resource={resource} />
    </ContainerNarrow>
  );
}

export default Data;
