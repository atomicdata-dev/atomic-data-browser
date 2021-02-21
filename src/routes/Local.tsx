import * as React from 'react';
import { useParams } from 'react-router-dom';
import ResourcePage from '../components/ResourcePage';

/** Show a resource where the domain matches the current domain */
const Local: React.FunctionComponent = () => {
  // const { path } = useParams();
  // const subject = window.location.origin + '/' + path;
  // const subject = 'http://localhost' + '/' + path;

  return <ResourcePage key={window.location.href} subject={window.location.href} />;
};

export default Local;
