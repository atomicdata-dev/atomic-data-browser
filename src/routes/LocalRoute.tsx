import * as React from 'react';
import { match } from 'react-router-dom';
import ResourcePage from '../components/ResourcePage';

type LocalRouteProps = {
  match?: match<string>;
};

/** Show a resource where the domain matches the current domain */
function Local(props: LocalRouteProps) {
  // The key makes sure the component re-renders when it changes
  return <ResourcePage key={props.match.url} subject={window.location.origin + props.match.url} />;
}

export default Local;
