import React, { useState } from 'react';
import { useResource, useStore } from '@tomic/react';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import AtomicLink from '../components/Link';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { PropValRow, PropertyLabel } from '../components/PropVal';
import { Button } from '../components/Button';
import { ErrMessage } from '../components/forms/InputStyles';
import { signRequest } from '@tomic/lib';
import { useSettings } from '../helpers/AppSettings';
import { CodeBlock } from '../components/CodeBlock';

/** Renders the data of some Resource */
function Data(): JSX.Element {
  const [subject] = useCurrentSubject();
  const resource = useResource(subject);
  const [textResponse, setTextResponse] = useState(null);
  const [textResponseLoading, setTextResponseLoading] = useState(false);
  const [err, setErr] = useState(null);
  const { agent } = useSettings();
  const store = useStore();

  if (resource.loading) {
    return <ContainerNarrow>Loading {subject}...</ContainerNarrow>;
  }
  if (resource.error) {
    return <ContainerNarrow>{resource.getError().message}</ContainerNarrow>;
  }

  async function fetchAs(contentType: string) {
    let headers: HeadersInit = new Headers();
    headers.set('Accept', contentType);
    if (agent) {
      headers = await signRequest(subject, agent, headers);
    }
    setTextResponseLoading(true);
    try {
      const resp = await window.fetch(subject, { headers });
      const body = await resp.text();
      setTextResponseLoading(false);
      setTextResponse(body);
      setErr(null);
    } catch (e) {
      setTextResponseLoading(false);
      setErr(e);
    }
  }

  return (
    <ContainerNarrow about={subject}>
      <h1>data view</h1>
      <PropValRow columns>
        <PropertyLabel title='The URL of the resource'>subject:</PropertyLabel>
        <AtomicLink subject={subject}>{subject}</AtomicLink>
      </PropValRow>
      <AllProps resource={resource} editable columns />
      {resource.getCommitBuilder().hasUnsavedChanges() ? (
        <>
          <h2>⚠️ contains uncommitted changes</h2>
          <p>This means that (some) of your local changes are not yet saved.</p>
          {resource.commitError && (
            <ErrMessage>{resource.commitError.message}</ErrMessage>
          )}
          <Button onClick={() => resource.save(store)}>save</Button>
        </>
      ) : null}
      <div>
        <span>Fetch as: </span>
        <Button
          subtle
          onClick={() => fetchAs('application/ad+json')}
          data-test='fetch-json-ad'
        >
          JSON-AD
        </Button>
        <Button
          subtle
          onClick={() => fetchAs('application/json')}
          data-test='fetch-json'
        >
          JSON
        </Button>
        <Button
          subtle
          onClick={() => fetchAs('application/ld+json')}
          data-test='fetch-json-ld'
        >
          JSON-LD
        </Button>
        <Button
          subtle
          onClick={() => fetchAs('text/turtle')}
          data-test='fetch-turtle'
        >
          Turtle / N-triples / N3
        </Button>
      </div>
      {err && <p>{err.message}</p>}
      {!err && textResponse && (
        <CodeBlock content={textResponse} loading={textResponseLoading} />
      )}
    </ContainerNarrow>
  );
}

export default Data;
