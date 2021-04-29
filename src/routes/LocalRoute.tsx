import * as React from 'react';
import { useLocation } from 'react-router-dom';
import ResourcePage from '../components/ResourcePage';

/** Show a resource where the domain matches the current domain */
function Local(): JSX.Element {
  const { pathname, search } = useLocation();

  // The key makes sure the component re-renders when it changes
  return <ResourcePage key={pathname} subject={window.location.origin + pathname + search} />;
}

export default Local;
