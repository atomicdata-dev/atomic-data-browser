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

  if (status == ResourceStatus.loading) {
    return <ContainerNarrow>Loading...</ContainerNarrow>;
  }
  if (status == ResourceStatus.error) {
    return <ContainerNarrow>{resource.getError().message}</ContainerNarrow>;
  }

  async function fetchAs(contentType: string) {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Accept', contentType);
    const resp = await window.fetch(subject, { headers: requestHeaders });
    const body = await resp.text();
    setTextResponse(body);
  }

  return (
    <ContainerNarrow about={subject}>
      <h1>data view</h1>
      <PropValRow>
        <PropertyLabel>subject:</PropertyLabel>
        <AtomicLink subject={subject}>{subject}</AtomicLink>
      </PropValRow>
      <AllProps resource={resource} />
      {resource.getCommitBuilder().hasUnsavedChanges() ? '⚠️ contains uncommitted changes' : null}
      <div>
        <span>Fetch as: </span>
        <Button subtle onClick={() => fetchAs('application/ad+json')}>
          JSON-AD
        </Button>
        <Button subtle onClick={() => fetchAs('application/json')}>
          JSON
        </Button>
        <Button subtle onClick={() => fetchAs('application/ld+json')}>
          JSON-LD
        </Button>
        <Button subtle onClick={() => fetchAs('text/turtle')}>
          Turtle / N-triples / N3
        </Button>
      </div>
      {textResponse && (
        <>
          <CodeBlock>{textResponse}</CodeBlock>
          <Button onClick={() => navigator.clipboard.writeText(textResponse)}>Copy to clipboard</Button>
        </>
      )}
    </ContainerNarrow>
  );
}

const CodeBlock = styled.pre`
  background-color: ${p => p.theme.colors.bg1};
  padding: 0.3rem;
  font-family: monospace;
  width: 100%;
  overflow-x: auto;
`;

export default Data;
