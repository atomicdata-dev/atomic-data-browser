import React from 'react';
// import ErrorBoundary from './ErrorBoundary';
import { useResource } from '../lib/react';

type Props = {
  subject: string;
};

function Resource({ subject }: Props): JSX.Element {
  const resource = useResource(subject);

  // return (
  //   <ErrorBoundary>
  //     <div>{resource.get('myProp').toString()}</div>
  //   </ErrorBoundary>
  // );

  if (resource == undefined) {
    return <p>Resource is undefined.</p>;
  } else {
    return <p>{resource.get('myProp').toString()}</p>;
  }
}

export default Resource;
