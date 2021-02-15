import React from 'react';
import { useResource } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import { StringParam, useQueryParam } from 'use-query-params';
import AtomicLink from '../components/Link';
import { ButtonMargin } from '../components/Button';
import { editURL } from '../helpers/navigation';
import { useHistory } from 'react-router-dom';

/** Renders the data of some Resource */
function Data(): JSX.Element {
  const [subject] = useQueryParam('subject', StringParam);
  const [resource] = useResource(subject);
  const history = useHistory();
  const status = resource.getStatus();

  if (status == ResourceStatus.loading) {
    return <ContainerNarrow>Loading...</ContainerNarrow>;
  }
  if (status == ResourceStatus.error) {
    return <ContainerNarrow>{resource.getError().message}</ContainerNarrow>;
  }

  return (
    <ContainerNarrow about={subject}>
      <h1>data view</h1>
      <h3>
        subject: <AtomicLink url={subject}>{subject}</AtomicLink>
      </h3>
      <ButtonMargin type='button' onClick={() => history.push(editURL(subject))}>
        Edit
      </ButtonMargin>
      <AllProps resource={resource} />
    </ContainerNarrow>
  );
}

export default Data;
