import * as React from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import { AddressBar } from './AddressBar';
import ResourcePage from './ResourcePage';
import { Welcome } from './Welcome';

/** A generic Atomic Data browser */
const Browser: React.FunctionComponent = () => {
  // Value shown in navbar, after Submitting
  const [subject] = useQueryParam('subject', StringParam);

  return (
    <React.Fragment>
      <AddressBar />
      {subject ? <ResourcePage key={subject} subject={subject} /> : <Welcome />}
    </React.Fragment>
  );
};

export default Browser;
