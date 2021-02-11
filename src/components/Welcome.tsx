import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { Container } from './Containers';
import Link, { LinkView } from './Link';

export const Welcome: React.FunctionComponent = () => {
  const history = useHistory();

  return (
    <Container>
      <h1>Atomic Data Browser</h1>
      <p>
        <a href='https://atomicdata.dev'>Atomic Data</a> is a new set of standards designed to make it easier to share and create linked
        data
      </p>
      <p>
        This app is for viewing, editing and creating Atomic Data. It&apos;s built with{' '}
        <a href='https://github.com/joepio/atomic-react'>atomic-react</a>, a typescript library for rendering and editing Atomic Data. Check
        out the <a href='https://docs.atomicdata.dev/'>docs</a> for more info about Atomic Data.
      </p>
      <p>
        You can edit app settings, such as theme color at <LinkView onClick={() => history.push('/settings')}>/settings</LinkView>.
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
        ...and visit <Link url='http://localhost/collections'>localhost</Link>!
      </p>
    </Container>
  );
};
