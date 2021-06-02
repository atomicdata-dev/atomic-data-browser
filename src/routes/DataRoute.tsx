import React from 'react';
import { useResource, useStore } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import AtomicLink from '../components/Link';
import { ButtonMargin } from '../components/Button';
import { useHistory } from 'react-router-dom';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import Parent from '../components/Parent';
import ResourceContextMenu from '../components/ResourceContextMenu';
import { PropValRow, PropertyLabel } from '../components/PropVal';

/** Renders the data of some Resource */
function Data(): JSX.Element {
  const [subject] = useCurrentSubject();
  const [resource] = useResource(subject);
  const history = useHistory();
  const store = useStore();
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
      <h1>
        data view
        <ResourceContextMenu hide={['data']} resource={resource} />
      </h1>
      <PropValRow>
        <PropertyLabel>subject:</PropertyLabel>
        <AtomicLink url={subject}>{subject}</AtomicLink>
      </PropValRow>
      <AllProps resource={resource} />
    </ContainerNarrow>
  );
}

export default Data;
