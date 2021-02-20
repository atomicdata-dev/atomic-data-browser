import * as React from 'react';
import { checkValidURL } from '../atomic-lib/client';
import ResourcePage from '../components/ResourcePage';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { Search } from './Search';
import { Welcome } from './Welcome';

/** A generic Atomic Data browser */
const Show: React.FunctionComponent = () => {
  // Value shown in navbar, after Submitting
  const [subject] = useCurrentSubject();

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

export default Show;
