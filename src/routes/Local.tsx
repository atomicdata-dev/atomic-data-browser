import * as React from 'react';
import ResourcePage from '../components/ResourcePage';

/** Show a resource where the domain matches the current domain */
const Local: React.FunctionComponent = () => {
  // I don't use params from react-router here, because it also needs to match sub-paths
  return <ResourcePage key={window.location.href} subject={window.location.href} />;
};

export default Local;
