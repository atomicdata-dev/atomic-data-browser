import { properties, useArray, useImporter, useTitle } from '@tomic/react';
import React, { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { ContainerNarrow } from '../components/Containers';
import Field from '../components/forms/Field.jsx';
import {
  InputStyled,
  InputWrapper,
  TextAreaStyled,
} from '../components/forms/InputStyles.jsx';
import Parent from '../components/Parent';
import ResourceCard from './Card/ResourceCard';
import { ErrorLook } from './ResourceInline.jsx';
import { ResourcePageProps } from './ResourcePage';

/** Importer Resource for uploading JSON-AD * */
export function ImporterPage({ resource }: ResourcePageProps) {
  const {
    importJsonAd,
    importURL,
    success,
    resource: resourceInternal,
  } = useImporter(resource.getSubject());
  const title = useTitle(resource);
  const [results] = useArray(resourceInternal, properties.endpoint.results);
  const [jsonAd, setJsonAd] = useState('');
  const [url, setUrl] = useState('');

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      <Field label='JSON' helper='JSON string'>
        <InputWrapper>
          <TextAreaStyled
            cols={4}
            placeholder='Paste your JSON-AD...'
            value={jsonAd}
            onChange={e => setJsonAd(e.target.value)}
          >
            {jsonAd}
          </TextAreaStyled>
        </InputWrapper>
      </Field>
      {jsonAd !== '' && (
        <Button onClick={() => importJsonAd(jsonAd)}>Send JSON</Button>
      )}
      <Field label='URL' helper='Place where a JSON-AD resource is hosted'>
        <InputWrapper>
          <InputStyled
            placeholder='enter a URL...'
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </InputWrapper>
      </Field>
      {url !== '' && <Button onClick={() => importURL(url)}>Fetch URL</Button>}
      <p>
        {resourceInternal.error && (
          <ErrorLook>{resourceInternal.error.message}</ErrorLook>
        )}
        {resourceInternal.loading && 'loading...'}
        {success && 'Success!'}
      </p>
      <p>Imported Resources:</p>
      {results && results.length == 0 ? (
        <p>No hits</p>
      ) : (
        results.map(result => {
          return <ResourceCard key={result} subject={result} />;
        })
      )}
    </ContainerNarrow>
  );
}
