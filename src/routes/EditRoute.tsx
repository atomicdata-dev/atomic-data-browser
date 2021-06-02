import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useResource, useStore, useTitle } from '../atomic-react/hooks';
import { newURL } from '../helpers/navigation';
import { ContainerNarrow } from '../components/Containers';
import { InputStyled } from '../components/forms/InputStyles';
import { ResourceForm } from '../components/forms/ResourceForm';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import ResourceContextMenu from '../components/ResourceContextMenu';
import { Button } from '../components/Button';

/** Form for instantiating a new Resource from some Class */
export function Edit(): JSX.Element {
  const [subject] = useCurrentSubject();
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  // const [subject, setNewSubject] = useState<string>(null);
  const [subjectInput, setSubjectInput] = useState<string>(null);
  const history = useHistory();
  const store = useStore();

  function handleClassSet(e) {
    e.preventDefault();
    history.push(newURL(subjectInput));
  }

  function handleDestroy() {
    if (window.confirm('Are you sure you want to permanently delete this resource?')) {
      resource.destroy(store);
      history.push('/');
    }
  }

  return (
    <ContainerNarrow>
      {/* Key is required for re-rendering when subject changes */}
      {subject ? (
        <>
          <h1>
            edit {title}
            <ResourceContextMenu resource={resource} hide={['edit']} />
          </h1>
          <Button onClick={handleDestroy} subtle>
            delete
          </Button>
          <ResourceForm resource={resource} key={subject} />
        </>
      ) : (
        <form onSubmit={handleClassSet}>
          <h1>edit a resource</h1>
          {/* <LabelStyled>new resource URL</LabelStyled>
      <InputStyled value={subject || null} onChange={e => setNewSubject(e.target.value)} placeholder={'URL of the new resource...'} /> */}
          <InputStyled
            value={subjectInput || null}
            onChange={e => setSubjectInput(e.target.value)}
            placeholder={'Enter a Resource URL...'}
          />
        </form>
      )}
    </ContainerNarrow>
  );
}
