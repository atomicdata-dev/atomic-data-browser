import { useResource, useString } from '@tomic/react';
import { urls } from '@tomic/react';
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
import { ResourceInline } from '../views/ResourceInline';
import styled from 'styled-components';

/** Start page for instantiating a new Resource from some Class */
function New(): JSX.Element {
  const [classSubject] = useQueryString('classSubject');
  const [parentSubject] = useQueryString('parentSubject');
  // For selecting a class
  const [classInput, setClassInput] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const navigate = useNavigate();
  const classFull = useResource(classInput);
  const [className] = useString(classFull, urls.properties.shortname);
  const { drive } = useSettings();

  const calculatedParent = parentSubject || drive;

  function handleClassSet(e) {
    if (!classInput) {
      setError(new Error('Please select a class'));

      return;
    }

    e.preventDefault();
    navigate(newURL(classInput, calculatedParent));
  }

  return (
    <ContainerNarrow>
      {classSubject ? (
        <NewFormFullPage classSubject={classSubject.toString()} />
      ) : (
        <StyledForm onSubmit={handleClassSet}>
          <h1>
            Create new resource{' '}
            {parentSubject && (
              <>
                {`under `}
                <ResourceInline subject={parentSubject} />
              </>
            )}
          </h1>
          <div>
            <ResourceSelector
              setSubject={setClassInput}
              value={classInput}
              error={error}
              setError={setError}
              classType={urls.classes.class}
            />
          </div>
          <Row wrapFlex>
            {classInput && (
              <Button onClick={handleClassSet}>new {className}</Button>
            )}
            {!classInput && (
              <>
                <NewIntanceButton
                  klass={urls.classes.folder}
                  subtle
                  parent={calculatedParent}
                />
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
        </StyledForm>
      )}
    </ContainerNarrow>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.margin}rem;
`;

export default New;
