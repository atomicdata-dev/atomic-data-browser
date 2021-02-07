import * as React from 'react';
import { Container } from './Container';
import Link from './Link';

export const Welcome: React.FunctionComponent = () => {
  return (
    <Container>
      <h1>Atomic-React Browser</h1>
      <p>
        This app is built using <a href='https://github.com/joepio/atomic-react'>atomic-react</a>, a typescript library for rendering and
        editing Atomic Data. Check out the <a href='https://docs.atomicdata.dev/'>docs</a> for more info about Atomic Data.
      </p>
      <p>Things to visit with this browser:</p>
      <ul>
        <li>
          <Link url='https://atomicdata.dev/collections'>atomicdata.dev</Link>
        </li>
        <li>
          <Link url='https://surfy.ddns.net/collections'>surfy.ddns.net</Link>
        </li>
      </ul>
      <p>Or run your own server...</p>
      <p>
        <code>docker run -p 80:80 -p 443:443 -v atomic-storage:/atomic-storage joepmeneer/atomic-server</code>
      </p>
      <p>
        ...and visist <Link url='http://localhost/collections'>localhost</Link>!
      </p>
    </Container>
  );
};
