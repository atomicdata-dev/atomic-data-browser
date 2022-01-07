import * as React from 'react';
import { ContainerNarrow } from '../components/Containers';
import AtomicLink from '../components/AtomicLink';
import { Logo } from '../components/Logo';

export const About: React.FunctionComponent = () => {
  return (
    <ContainerNarrow>
      <Logo
        style={{ width: '30rem', maxWidth: '100%', marginBottom: '1rem' }}
      />
      <p>
        <em>
          The easiest way to <b>create</b>, <b>share</b> and <b>model</b> linked
          data.
        </em>
      </p>
      <p>
        Atomic Data is a proposed standard for modeling and exchanging linked
        data. It uses links to connect pieces of data, and therefore makes it
        easier to connect datasets to each other - even when these datasets
        exist on separate machines. It aims to help realize a more decentralized
        internet that encourages data ownership and interoperability.
      </p>
      <p>
        Atomic Data is especially suitable for knowledge graphs, distributed
        datasets, semantic data, p2p applications, decentralized apps, and data
        that is meant to be shared. It is designed to be highly extensible, easy
        to use, and to make the process of domain specific standardization as
        simple as possible. Check out{' '}
        <b>
          <AtomicLink href='https://docs.atomicdata.dev/'>the docs</AtomicLink>
        </b>{' '}
        for more information about Atomic Data.
      </p>
      <h2>About this app</h2>
      <p>
        You&apos;re looking at{' '}
        <AtomicLink href='https://github.com/joepio/atomic-data-browser'>
          atomic-data-browser
        </AtomicLink>
        , an open-source client for viewing and editing data. Please add an
        issue if you encouter problems or have a feature request. Expect bugs
        and issues, because this stuff is pretty beta.
      </p>
      <p>
        The back-end of this app is{' '}
        <AtomicLink href='https://github.com/joepio/atomic'>
          atomic-server
        </AtomicLink>
        , which you can think of as an open source, web-native database.
      </p>
      <h2>Things to visit</h2>
      <ul>
        <li>
          <AtomicLink subject='https://atomicdata.dev/collections'>
            List of lists
          </AtomicLink>
        </li>
        <li>
          <AtomicLink subject='https://atomicdata.dev/classes'>
            List of Classes
          </AtomicLink>
        </li>
        <li>
          <AtomicLink subject='https://atomicdata.dev/properties'>
            List of Properties
          </AtomicLink>
        </li>
      </ul>
      <h2>Run your own server</h2>
      <p>
        The easiest way to run an{' '}
        <AtomicLink href='https://github.com/joepio/atomic'>
          atomic-server
        </AtomicLink>{' '}
        is by using Docker:
      </p>
      <p>
        <code>
          docker run -p 80:80 -p 443:443 -v atomic-storage:/atomic-storage
          joepmeneer/atomic-server
        </code>
      </p>
      <p>
        ...and visit{' '}
        <AtomicLink subject='http://localhost'>localhost</AtomicLink>.
      </p>
      <h2>Join the community</h2>
      <p>
        Atomic Data is open and fully powered by volunteers. We&apos;re looking
        for people who want to help discuss various design challenges and work
        on implmenentations. If you have any questions, or want to help out,
        feel free to join our{' '}
        <AtomicLink href='https://discord.gg/a72Rv2P'>Discord</AtomicLink>! Sign
        up to{' '}
        <AtomicLink href='https://docs.atomicdata.dev/newsletter.html'>
          our newsletter
        </AtomicLink>{' '}
        if you{"'"}d like to get updated! .
      </p>
    </ContainerNarrow>
  );
};
