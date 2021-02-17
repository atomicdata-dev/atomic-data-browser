import * as React from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import { checkValidURL } from '../atomic-lib/client';
import ResourcePage from '../components/ResourcePage';
import { Search } from './Search';
import { Welcome } from './Welcome';

/** A generic Atomic Data browser */
const Browser: React.FunctionComponent = () => {
  // Value shown in navbar, after Submitting
  const [subject] = useQueryParam('subject', StringParam);

  if (subject == undefined || subject == '') {
    return <Welcome />;
  }
  try {
    checkValidURL(subject);
    return <ResourcePage key={subject} subject={subject} />;
  } catch (e) {
    return <Search query={subject} />;
  }
};

export default Browser;
