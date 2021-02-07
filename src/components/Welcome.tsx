import * as React from 'react';
import { Container } from './Container';
import Link from './Link';

export const Welcome: React.FunctionComponent = () => {
  return (
    <Container>
      <h1>Atomic Data</h1>
      <p>
        This app is built using <a href='https://github.com/joepio/atomic-react'>atomic-react</a>, a typescript library for rendering and
        editing Atomic Data.
      </p>
      <p>
        Check out the <a href='docs.atomicdata.dev/'>docs</a> for more info about the concept.
      </p>
      <p>Some Atomic Data servers to check out:</p>
      <ul>
        <li>
          <Link url='https://atomicdata.dev/collections'>atomicdata.dev</Link>
        </li>
        <li>
          <Link url='https://surfy.ddns.net/collections'>surfy.ddns.net</Link>
        </li>
      </ul>
    </Container>
  );
};
