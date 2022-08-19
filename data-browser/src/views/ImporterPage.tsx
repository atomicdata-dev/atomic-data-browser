import { properties, useArray, useImporter } from '@tomic/react';
import React, { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { ContainerNarrow } from '../components/Containers';
import { EditableTitle } from '../components/EditableTitle';
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
  const [results] = useArray(resourceInternal, properties.endpoint.results);
  const [jsonAd, setJsonAd] = useState('');
  const [url, setUrl] = useState('');

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Parent resource={resource} />
      <EditableTitle resource={resource} />
      <p>
        Import data using a JSON-AD string or URL pointing to a JSON-AD
        document. These can contain single or multiple resources. Read more
        about how importing Atomic Data works{' '}
        <a href='https://docs.atomicdata.dev/create-json-ad.html'>
          in the docs
        </a>
        .
      </p>
      <Field label='JSON-AD'>
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
      <Field label='URL' helper='http URL where a JSON-AD resource is hosted'>
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
      {results && results.length > 0 && (
        <>
          <p>Imported Resources:</p>
          {results.map(result => {
            return <ResourceCard key={result} subject={result} />;
          })}
        </>
      )}
    </ContainerNarrow>
  );
}
