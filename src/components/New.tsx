import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { StringParam, useQueryParam } from 'use-query-params';
import { handleError } from '../helpers/handlers';
import { createInstanceUrl, createSubjectUrl } from '../helpers/navigation';
import { classes, properties, urls } from '../helpers/urls';
import { useString, useResource, useTitle, useArray, useStore } from '../lib/react';
import { ResourceStatus } from '../lib/resource';
import { ButtonMargin } from './Button';
import { Container } from './Containers';
import Markdown from './datatypes/Markdown';
import FieldLabeled, { ErrMessage, InputStyled } from './forms/Field';
import Link from './Link';
import NewIntanceButton from './NewInstanceButton';

type NewProps = {
  classSubject: string;
  newSubject: string;
};

/** Form for instantiating a new Resource from some Class */
function New(): JSX.Element {
  const [classSubject] = useQueryParam('classSubject', StringParam);
  const [newSubject, setNewSubject] = useState<string>(null);
  const [classInput, setClassInput] = useState<string>(null);
  const history = useHistory();

  if (newSubject == undefined) {
    const random = Math.random().toString(36).substring(7);
    setNewSubject(`local:${random}`);
  }

  function Examples(): JSX.Element {
    return (
      <div>
        <NewIntanceButton klass={urls.classes.class} />
        <NewIntanceButton klass={urls.classes.property} />
      </div>
    );
  }

  function handleClassSet(e) {
    e.preventDefault();
    history.push(createInstanceUrl(classInput));
  }

  return (
    <Container>
      {/* Key is required for re-rendering when subject changes */}
      {classSubject ? (
        <NewForm classSubject={classSubject} key={`${classSubject}+${newSubject}`} newSubject={newSubject} />
      ) : (
        <form onSubmit={handleClassSet}>
          <h1>Create something new</h1>
          {/* <LabelStyled>new resource URL</LabelStyled>
      <InputStyled value={newSubject || null} onChange={e => setNewSubject(e.target.value)} placeholder={'URL of the new resource...'} /> */}
          <Examples />
          <p>... or enter the URL of an existing Class:</p>
          <InputStyled value={classInput || null} onChange={e => setClassInput(e.target.value)} placeholder={'Enter a Class URL...'} />
        </form>
      )}
    </Container>
  );
}

function NewForm({ classSubject, newSubject }: NewProps): JSX.Element {
  const [klass] = useResource(classSubject);
  const store = useStore();
  const [newResource] = useResource(newSubject);
  const status = klass.getStatus();
  const [requires] = useArray(klass, properties.requires);
  const [recommends] = useArray(klass, properties.recommends);
  const title = useTitle(klass);
  const [description] = useString(klass, properties.description);
  const [klassIsa] = useString(klass, properties.isA);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);
  const history = useHistory();

  if (status == ResourceStatus.loading) {
    return <React.Fragment>Loading...</React.Fragment>;
  }
  if (status == ResourceStatus.error) {
    return <React.Fragment>{klass.getError().message}</React.Fragment>;
  }
  if (klassIsa !== classes.class) {
    return <React.Fragment>{classSubject} is not a Class</React.Fragment>;
  }

  async function save() {
    try {
      newResource.setStatus(ResourceStatus.ready);
      await newResource.setValidate(urls.properties.isA, [klass.getSubject()], store);
      const newUrlString = await newResource.save(store);
      setSaving(false);
      // Redirect to newly created resource
      history.push(createSubjectUrl(newUrlString));
    } catch (e) {
      handleError(e);
      setErr(e);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    save();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>
        new <Link url={classSubject}>{title}</Link>
      </h2>
      {description && <Markdown text={description} />}
      {requires.map(property => {
        return <FieldLabeled key={property} property={property} resource={newResource} required />;
      })}
      {recommends.map(property => {
        return <FieldLabeled key={property} property={property} resource={newResource} />;
      })}
      {err && <ErrMessage>{err.message}</ErrMessage>}
      <ButtonMargin type='submit' onClick={handleSubmit} disabled={saving}>
        {saving ? 'wait...' : 'save locally'}
      </ButtonMargin>
    </form>
  );
}

export default New;
