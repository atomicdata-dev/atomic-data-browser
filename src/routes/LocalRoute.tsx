import * as React from 'react';
import { match, useLocation } from 'react-router-dom';
import ResourcePage from '../components/ResourcePage';

type LocalRouteProps = {
  match?: match<string>;
};

/** Show a resource where the domain matches the current domain */
function Local(props: LocalRouteProps) {
  const { pathname } = useLocation();

  // The key makes sure the component re-renders when it changes
  return <ResourcePage key={pathname} subject={window.location.origin + pathname} />;
}

export default Local;
