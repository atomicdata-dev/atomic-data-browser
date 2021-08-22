import React, { useState } from 'react';
import { useResource } from '@tomic/react';
import { ResourceStatus } from '@tomic/lib';
import AllProps from '../components/AllProps';
import { ContainerNarrow } from '../components/Containers';
import AtomicLink from '../components/Link';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { PropValRow, PropertyLabel } from '../components/PropVal';
import { Button } from '../components/Button';
import styled from 'styled-components';

/** Renders the data of some Resource */
function Data(): JSX.Element {
  const [subject] = useCurrentSubject();
  const [resource] = useResource(subject);
  const status = resource.getStatus();
  const [textResponse, setTextResponse] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [err, setErr] = useState(null);

  if (status == ResourceStatus.loading) {
    return <ContainerNarrow>Loading...</ContainerNarrow>;
  }
  if (status == ResourceStatus.error) {
    return <ContainerNarrow>{resource.getError().message}</ContainerNarrow>;
  }

  async function fetchAs(contentType: string) {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Accept', contentType);
    setErr(new Error('loading...'));
    try {
      const resp = await window.fetch(subject, { headers: requestHeaders });
      const body = await resp.text();
      setTextResponse(body);
      setErr(null);
    } catch (e) {
      setErr(e);
    }
    setIsCopied(false);
  }

  function copyToClipboard() {
    setIsCopied(true);
    navigator.clipboard.writeText(textResponse);
  }

  return (
    <ContainerNarrow about={subject}>
      <h1>data view</h1>
      <PropValRow>
        <PropertyLabel>subject:</PropertyLabel>
        <AtomicLink subject={subject}>{subject}</AtomicLink>
      </PropValRow>
      <AllProps resource={resource} editable columns />
      {resource.getCommitBuilder().hasUnsavedChanges()
        ? '⚠️ contains uncommitted changes'
        : null}
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
        <>
          <CodeBlock>{textResponse}</CodeBlock>
          <Button onClick={copyToClipboard} data-test='copy-response'>
            {isCopied ? 'Copied!' : 'Copy to clipboard'}
          </Button>
        </>
      )}
    </ContainerNarrow>
  );
}

const CodeBlock = styled.pre`
  background-color: ${p => p.theme.colors.bg1};
  border-radius: ${p => p.theme.radius};
  border: solid 1px ${p => p.theme.colors.bg2};
  padding: 0.3rem;
  font-family: monospace;
  width: 100%;
  overflow-x: auto;
`;

export default Data;
