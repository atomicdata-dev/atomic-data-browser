import * as React from 'react';
import { Resource, properties } from '@tomic/lib';
import { useArray } from '@tomic/react';

import { ContainerNarrow } from '../components/Containers';

type DrivePageProps = {
  resource: Resource;
};

/** A full page, editable document, consisting of Blocks */
function DocumentPage({ resource }: DrivePageProps): JSX.Element {
  const [elements, setElements] = useArray(
    resource,
    properties.document.elements,
  );

  function handleCreateElement() {
    elements.push('newSubject');
    setElements(elements);
  }

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <h1>Document</h1>
      {elements.map(element => (
        <p key={element}>{element}</p>
      ))}
      <input value={'new element'} onChange={handleCreateElement} />
    </ContainerNarrow>
  );
}

export default DocumentPage;
