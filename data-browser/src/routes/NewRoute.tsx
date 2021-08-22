import {
  useArray,
  useResource,
  useStore,
  useString,
  useTitle,
} from '@tomic/react';
import { properties, urls } from '@tomic/lib';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { StringParam, useQueryParam } from 'use-query-params';

import { newURL } from '../helpers/navigation';
import { ContainerNarrow } from '../components/Containers';
import { InputStyled, InputWrapper } from '../components/forms/InputStyles';
import NewIntanceButton from '../components/NewInstanceButton';
import { ResourceForm } from '../components/forms/ResourceForm';
import AtomicLink from '../components/Link';
import Markdown from '../components/datatypes/Markdown';
import Field from '../components/forms/Field';
import { ResourceSelector } from '../components/forms/ResourceSelector';
import { Button } from '../components/Button';
import { FaInfo } from 'react-icons/fa';
import { useSettings } from '../helpers/AppSettings';

/** Start page for instantiating a new Resource from some Class */
function New(): JSX.Element {
  const [classSubject] = useQueryParam('classSubject', StringParam);
  // For selecting a class
  const [classInput, setClassInput] = useState<string>(null);
  const [error, setError] = useState<Error>(null);
  const history = useHistory();
  const [classFull] = useResource(classInput);
  const [className] = useString(classFull, urls.properties.shortname);
  const { agent } = useSettings();

  function handleClassSet(e) {
    e.preventDefault();
    history.push(newURL(classInput, agent?.subject));
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
          {classInput && (
            <Button onClick={handleClassSet}>new {className}</Button>
          )}
          {!classInput && (
            <>
              <NewIntanceButton klass={urls.classes.document} subtle />
              <NewIntanceButton klass={urls.classes.class} subtle />
              <NewIntanceButton klass={urls.classes.property} subtle />
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
  // TODO: Don't push to history, but replace, because currenlty back is broken
  const [newSubject, setNewSubject] = useQueryParam('newSubject', StringParam);
  const [parentSubject] = useQueryParam('parent', StringParam);
  const klassTitle = useTitle(klass);
  const [klassShortname] = useString(klass, properties.shortname);
  const [klassDescription] = useString(klass, properties.description);
  const [showDetails, setShowDetails] = useState(false);
  const [subjectErr, setSubjectErr] = useState<Error>(null);
  const store = useStore();
  const [resource] = useResource(newSubject, true);

  useEffect(() => {
    if (newSubject == undefined) {
      setNewSubject(store.createSubject(klassShortname));
    }
  }, [newSubject]);

  // Set the class for new resources
  const [currentClass] = useArray(resource, properties.isA);
  if (currentClass.length == 0) {
    resource.set(properties.isA, [klass.getSubject()], store);
  }

  /** Changes the URL of a subject. Updates the store */
  // Should be debounced as it is quite expensive, but getting that to work turned out to be really hard
  async function handleSetSubject(url: string) {
    setSubjectErr(null);
    try {
      // Expensive!
      await store.renameSubject(resource.getSubject(), url);
      setNewSubject(url);
    } catch (e) {
      setSubjectErr(e);
    }
  }

  return (
    <>
      <h2>
        new <AtomicLink subject={classSubject}>{klassTitle}</AtomicLink>{' '}
        <Button
          onClick={() => setShowDetails(!showDetails)}
          icon
          subtle={!showDetails}
          title='Toggle show Class details'
        >
          <FaInfo />
        </Button>
      </h2>
      {showDetails && klassDescription && <Markdown text={klassDescription} />}
      <Field
        error={subjectErr}
        label='subject'
        helper='The identifier of the resource. This also determines where the resource is saved, by default.'
      >
        <InputWrapper>
          <InputStyled
            value={newSubject || ''}
            onChange={e => handleSetSubject(e.target.value)}
            placeholder={'URL of the new resource...'}
          />
        </InputWrapper>
      </Field>
      {/* Key is required for re-rendering when subject changes */}
      <ResourceForm
        resource={resource}
        classSubject={classSubject}
        key={`${classSubject}+${newSubject}`}
        parent={parentSubject}
      />
    </>
  );
}

export default New;
