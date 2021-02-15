import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { StringParam, useQueryParam } from 'use-query-params';
import { useResource, useTitle } from '../atomic-react/hooks';
import { newURL } from '../helpers/navigation';
import { ContainerNarrow } from '../components/Containers';
import { InputStyled } from '../components/forms/InputStyles';
import { ResourceForm } from '../components/forms/ResourceForm';

/** Form for instantiating a new Resource from some Class */
export function Edit(): JSX.Element {
  const [subject] = useQueryParam('subject', StringParam);
  const [resource] = useResource(subject);
  const title = useTitle(resource);
  // const [subject, setNewSubject] = useState<string>(null);
  const [subjectInput, setSubjectInput] = useState<string>(null);
  const history = useHistory();

  function handleClassSet(e) {
    e.preventDefault();
    history.push(newURL(subjectInput));
  }

  return (
    <ContainerNarrow>
      {/* Key is required for re-rendering when subject changes */}
      {subject ? (
        <>
          <h1>edit {title}</h1>
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
