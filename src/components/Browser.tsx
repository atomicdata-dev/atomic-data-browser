import * as React from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { AddressBar } from './AddressBar';
import ResourcePage from './ResourcePage';

const Browser: React.FunctionComponent = () => {
  // Value shown in navbar, after Submitting
  const [subject] = useQueryParam('subject', StringParam);

  return (
    <Container>
      <AddressBar />
      {subject && <ResourcePage key={subject} subject={subject} />}
    </Container>
  );
};

const Container = styled.div`
  max-width: 40rem;
  margin: auto;
`;

export default Browser;
