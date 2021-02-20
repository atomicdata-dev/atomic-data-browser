import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ContainerNarrow } from '../components/Containers';
import AtomicLink, { LinkView } from '../components/Link';

export const Welcome: React.FunctionComponent = () => {
  const history = useHistory();

  return (
    <ContainerNarrow>
      <h1>Atomic Data Browser</h1>
      <p>
        <a href='https://atomicdata.dev'>Atomic Data</a> is a new set of standards designed to make it easier to share, create and model
        linked data. Check out the <a href='https://docs.atomicdata.dev/'>docs</a> for more information about Atomic Data.
      </p>
      <p>
        This app is for viewing, editing and creating Atomic Data. It&apos;s free and open source on{' '}
        <a href='https://github.com/joepio/atomic-data-browser'>github</a>. Please add an issue if you encouter problems or have a feature
        request. Expect bugs and issues, because this stuff is pretty beta.
      </p>
      <p>
        You can edit app settings, such as current user and theme color at{' '}
        <LinkView onClick={() => history.push('/settings')}>/settings</LinkView>.
      </p>
      <p>
        Check out the keyboard shortcuts at <LinkView onClick={() => history.push('/shortcuts')}>/shortcuts</LinkView>.
      </p>
      <p>
        Some <a href='https://github.com/joepio/atomic'>atomic-servers</a> to visit with this browser:
      </p>
      <ul>
        <li>
          <AtomicLink url='https://atomicdata.dev/collections'>atomicdata.dev</AtomicLink>
        </li>
        <li>
          <AtomicLink url='https://surfy.ddns.net/collections'>surfy.ddns.net</AtomicLink>
        </li>
      </ul>
      <p>Or run your own server...</p>
      <p>
        <code>docker run -p 80:80 -p 443:443 -v atomic-storage:/atomic-storage joepmeneer/atomic-server</code>
      </p>
      <p>
        ...and visit <AtomicLink url='http://localhost/collections'>localhost</AtomicLink>.
      </p>
      <p>
        If you have any questions, feel free to join our <a href='https://discord.gg/a72Rv2P'>Discord</a>!
      </p>
    </ContainerNarrow>
  );
};
