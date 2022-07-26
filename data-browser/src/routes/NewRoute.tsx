import { useResource, useString } from '@tomic/react';
import { urls } from '@tomic/lib';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import { newURL, useQueryString } from '../helpers/navigation';
import { ContainerNarrow } from '../components/Containers';
import NewIntanceButton from '../components/NewInstanceButton';
import { ResourceSelector } from '../components/forms/ResourceSelector';
import { Button } from '../components/Button';
import { useSettings } from '../helpers/AppSettings';
import { Row } from '../components/Row';
import { NewFormFullPage } from '../components/forms/NewForm/index';

/** Start page for instantiating a new Resource from some Class */
function New(): JSX.Element {
  const [classSubject] = useQueryString('classSubject');
  // For selecting a class
  const [classInput, setClassInput] = useState<string>(null);
  const [error, setError] = useState<Error>(null);
  const navigate = useNavigate();
  const classFull = useResource(classInput);
  const [className] = useString(classFull, urls.properties.shortname);
  const { agent } = useSettings();

  function handleClassSet(e) {
    e.preventDefault();
    navigate(newURL(classInput, agent?.subject));
  }

  return (
    <ContainerNarrow>
      {classSubject ? (
        <NewFormFullPage classSubject={classSubject.toString()} />
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
          <Row>
            {classInput && (
              <Button onClick={handleClassSet}>new {className}</Button>
            )}
            {!classInput && (
              <>
                <NewIntanceButton klass={urls.classes.document} subtle />
                <NewIntanceButton klass={urls.classes.class} subtle />
                <NewIntanceButton klass={urls.classes.property} subtle />
                <NewIntanceButton klass={urls.classes.chatRoom} subtle />
                <NewIntanceButton klass={urls.classes.bookmark} subtle />
              </>
            )}
          </Row>
        </form>
      )}
    </ContainerNarrow>
  );
}

export default New;
