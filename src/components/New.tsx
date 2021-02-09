import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { StringParam, useQueryParam } from 'use-query-params';
import { handleError } from '../helpers/handlers';
import { classes, properties, urls } from '../helpers/urls';
import { useString, useResource, useTitle, useArray } from '../lib/react';
import { ResourceStatus } from '../lib/resource';
import { ButtonMargin } from './Button';
import { Container } from './Container';
import Markdown from './datatypes/Markdown';
import FieldLabeled, { ErrMessage, InputStyled, LabelStyled } from './Field';

type NewProps = {
  classSubject: string;
};

/** Form for instantiating a new Resource from some Class */
function New(): JSX.Element {
  const [classSubject, setClassSubject] = useQueryParam('classSubject', StringParam);

  function Examples(): JSX.Element {
    return (
      <div>
        ... Or load one of these:
        <ul>
          <li onClick={() => setClassSubject(urls.classes.class)}>Class</li>
        </ul>
      </div>
    );
  }

  return (
    <Container>
      <h1>Create something new</h1>
      <LabelStyled>class URL</LabelStyled>
      <InputStyled value={classSubject} onChange={e => setClassSubject(e.target.value)} placeholder={'Enter a Class URL...'} />
      {/* Key is required for re-rendering when subject changes */}
      {classSubject ? <NewForm classSubject={classSubject} key={classSubject} /> : <Examples />}
    </Container>
  );
}

function NewForm({ classSubject }: NewProps): JSX.Element {
  const [klass] = useResource(classSubject);
  const [newResource] = useResource('local:new');
  const status = klass.getStatus();
  const requires = useArray(klass, properties.requires);
  const recommends = useArray(klass, properties.recommends);
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

  console.log('status ok', klass.getSubject());

  async function save() {
    try {
      const newUrl = await newResource.save();
      setSaving(false);
      history.push(newUrl);
    } catch (e) {
      handleError(e);
      setErr(e);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('submit?');
    setSaving(true);
    save();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>new {title}</h2>
      {description && <Markdown text={description} />}
      {requires.map(property => {
        return <FieldLabeled key={property} property={property} resource={newResource} required />;
      })}
      {recommends.map(property => {
        return <FieldLabeled key={property} property={property} resource={newResource} />;
      })}
      {err && <ErrMessage>{err.message}</ErrMessage>}
      <ButtonMargin type='submit' onClick={handleSubmit} disabled={saving}>
        {saving ? 'wait' : 'save'}
      </ButtonMargin>
    </form>
  );
}

export default New;
