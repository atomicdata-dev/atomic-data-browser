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
  const [parentSubject] = useQueryString('parentSubject');
  // For selecting a class
  const [classInput, setClassInput] = useState<string>(undefined);
  const [error, setError] = useState<Error>(null);
  const navigate = useNavigate();
  const classFull = useResource(classInput);
  const [className] = useString(classFull, urls.properties.shortname);
  const { drive } = useSettings();

  const calculatedParent = parentSubject || drive;

  function handleClassSet(e) {
    e.preventDefault();
    navigate(newURL(classInput, calculatedParent));
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
          <Row wrapFlex>
            {classInput && (
              <Button onClick={handleClassSet}>new {className}</Button>
            )}
            {!classInput && (
              <>
                <NewIntanceButton
                  klass={urls.classes.document}
                  subtle
                  parent={calculatedParent}
                />
                <NewIntanceButton
                  klass={urls.classes.chatRoom}
                  subtle
                  parent={calculatedParent}
                />
                <NewIntanceButton
                  klass={urls.classes.bookmark}
                  subtle
                  parent={calculatedParent}
                />
                <NewIntanceButton
                  klass={urls.classes.drive}
                  subtle
                  parent={calculatedParent}
                />
                <NewIntanceButton
                  klass={urls.classes.class}
                  subtle
                  parent={calculatedParent}
                />
                <NewIntanceButton
                  klass={urls.classes.property}
                  subtle
                  parent={calculatedParent}
                />
                <NewIntanceButton
                  klass={urls.classes.importer}
                  subtle
                  parent={calculatedParent}
                />
              </>
            )}
          </Row>
        </form>
      )}
    </ContainerNarrow>
  );
}

export default New;
