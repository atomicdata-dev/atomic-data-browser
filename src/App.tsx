import React from 'react';
import { useResource } from './lib/react';

function App(): void {
  const resource = useResource('mySubject');

  if (resource == undefined) {
    return <p>no resource</p>;
  }

  console.log('resource', resource);

  return (
    <div className='App'>
      <header className='App-header'>{resource.get('myProp').toString()}</header>
    </div>
  );
}

export default App;
