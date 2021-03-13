import React from 'react';
import { useResource, useStore } from '../atomic-react/hooks';
import { ResourceStatus } from '../atomic-lib/resource';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import AtomicLink from '../components/Link';
import { ButtonMargin } from '../components/Button';
import { editURL, openURL } from '../helpers/navigation';
import { useHistory } from 'react-router-dom';
import { useCurrentSubject } from '../helpers/useCurrentSubject';

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

  function handleDestroy() {
    resource.destroy(store);
    history.push('/');
  }

  return (
    <ContainerNarrow about={subject}>
      <h1>data view</h1>
      <h3>
        subject: <AtomicLink url={subject}>{subject}</AtomicLink>
      </h3>
      <AllProps resource={resource} />
      <ButtonMargin type='button' onClick={() => history.push(editURL(subject))}>
        edit
      </ButtonMargin>
      <ButtonMargin type='button' onClick={() => history.push(openURL(subject))}>
        normal view
      </ButtonMargin>
      <ButtonMargin type='button' onClick={handleDestroy}>
        delete
      </ButtonMargin>
    </ContainerNarrow>
  );
}

export default Data;
