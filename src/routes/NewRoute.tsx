import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { StringParam, useQueryParam } from 'use-query-params';
import { properties, urls } from '../helpers/urls';
import { newURL } from '../helpers/navigation';
import { useArray, useResource, useStore, useString, useTitle } from '../atomic-react/hooks';
import { ContainerNarrow } from '../components/Containers';
import { InputStyled, InputWrapper } from '../components/forms/InputStyles';
import NewIntanceButton from '../components/NewInstanceButton';
import { ResourceForm } from '../components/forms/ResourceForm';
import { ResourceStatus } from '../atomic-lib/resource';
import AtomicLink from '../components/Link';
import Markdown from '../components/datatypes/Markdown';
import Field from '../components/forms/Field';
import { ResourceSelector } from '../components/forms/ResourceSelector';
import { Button } from '../components/Button';

/** Start page for instantiating a new Resource from some Class */
function New(): JSX.Element {
  // Class related data
  const [classSubject] = useQueryParam('classSubject', StringParam);
  // For selecting a class
  const [classInput, setClassInput] = useState<string>(null);
  const [error, setError] = useState<Error>(null);
  const history = useHistory();
  const [classFull] = useResource(classInput);
  const [className] = useString(classFull, urls.properties.shortname);

  function handleClassSet(e) {
    e.preventDefault();
    history.push(newURL(classInput));
  }

  return (
    <ContainerNarrow>
      {classSubject ? (
        <NewForm classSubject={classSubject} />
      ) : (
        <form onSubmit={handleClassSet}>
          <h1>Create something new</h1>
          <ResourceSelector
            setSubject={setClassInput}
            value={classInput}
            error={error}
            setError={setError}
            classType={urls.classes.class}
          />
          <br />
          {classInput && <Button onClick={handleClassSet}>new {className}</Button>}
          {!classInput && (
            <>
              <NewIntanceButton klass={urls.classes.class} />
              <NewIntanceButton klass={urls.classes.property} />
            </>
          )}
        </form>
      )}
    </ContainerNarrow>
  );
}

interface NewFormProps {
  classSubject: string;
}

/** Form for instantiating a new Resource from some Class */
function NewForm({ classSubject }: NewFormProps): JSX.Element {
  const [klass] = useResource(classSubject);

  const klassTitle = useTitle(klass);
  const [klassDescription] = useString(klass, properties.description);
  /** Set the URL of the newly created subject. Will be a random string at first. */
  const [newSubject, setNewSubject] = useState<string>(null);

  const [subjectErr, setSubjectErr] = useState<Error>(null);
  const store = useStore();

  if (newSubject == undefined) {
    setNewSubject(store.createSubject());
  }

  const [resource] = useResource(newSubject);
  // Set the resource to ready - it's new, so it should be ready, even if it 500s at the server
  if (resource.getStatus() !== ResourceStatus.ready) {
    resource.setStatus(ResourceStatus.ready);
  }

  // Set the class for new resources
  const [currentClass] = useArray(resource, properties.isA);
  if (currentClass.length == 0) {
    resource.set(properties.isA, [klass.getSubject()], store);
  }

  /** Changes the URL of a subject. Updates the store */
  function handleSetSubject(url: string) {
    setSubjectErr(null);
    try {
      store.addResource(resource);
      store.renameSubject(resource.getSubject(), url);
    } catch (e) {
      setSubjectErr(e);
    }
    setNewSubject(url);
  }

  return (
    <>
      <h2>
        new <AtomicLink url={classSubject}>{klassTitle}</AtomicLink>
      </h2>
      {klassDescription && <Markdown text={klassDescription} />}
      <Field
        error={subjectErr}
        label='subject'
        helper='The identifier of the resource. This also determines where the resource is saved, by default.'
      >
        <InputWrapper>
          <InputStyled
            value={newSubject || null}
            onChange={e => handleSetSubject(e.target.value)}
            placeholder={'URL of the new resource...'}
          />
        </InputWrapper>
      </Field>
      {/* Key is required for re-rendering when subject changes */}
      <ResourceForm resource={resource} classSubject={classSubject} key={`${classSubject}+${newSubject}`} />
    </>
  );
}

export default New;
