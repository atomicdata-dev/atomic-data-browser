import React, { useEffect, useState } from 'react';
import { properties, Resource } from '@tomic/lib';
import { Helmet } from 'react-helmet-async';
import { ContainerNarrow } from './Containers';
import { useString, useTitle } from '@tomic/react';
import 'types-wm';
import Spinner from './Button';
import toast from 'react-hot-toast';
import Link from './Link';

type Props = {
  resource: Resource;
  children: React.ReactNode;
};

/** Returns true if the user is paying using WebMonetization */
export const useMonetization = () => {
  const [isPaying, setisPaying] = useState(false);

  useEffect(() => {
    if (!document.monetization) {
      // This means this user doesn't have monetization capabilities
      // i.e. they don't have the Coil extension installed on their browser
      setisPaying(false);
      return;
    }
    // Note: A user could have monetization capabilities (i.e. installed Coil)
    // but that doesn't mean they've actually signed up for an account!
    const { state } = document.monetization;

    // If the initial state is 'stopped', we can assume the user isn't
    // going to pay, and so we can stop loading
    if (state === 'stopped') {
      setisPaying(false);
    }

    // We add a listener to wait for the user to start paying
    document.monetization.addEventListener('monetizationstart', () => {
      setisPaying(true);
    });
  }, []);

  return isPaying;
};

/**
 * Wrap this around a component to only show it when a user is Paying for it
 * using WebMonetization. Will show instructions to the user if there is no
 * Instructs the user to install Coil. Shows progress and errors.
 */
function WebMonetizationWrapper({ resource, children }: Props): JSX.Element {
  const [paymentPointer] = useString(resource, properties.paymentPointer);
  const title = useTitle(resource);
  const isPaying = useMonetization();

  useEffect(() => {
    if (isPaying) {
      toast.success('WebMonetization started, thanks for your support!');
    }
  }, [isPaying]);

  // We need the meta tag to continue the payments
  if (isPaying) {
    return (
      <>
        <Helmet>
          <meta name='monetization' content={paymentPointer} />
        </Helmet>
        {children}
      </>
    );
  }

  return (
    <ContainerNarrow>
      <h1>{title}</h1>
      <Helmet>
        <meta name='monetization' content={paymentPointer} />
      </Helmet>
      {!isPaying && (
        <p>This content can only be accessed through Webmonetization.</p>
      )}
      {document.monetization == undefined && (
        <p>
          Get the{' '}
          <Link href='https://help.coil.com/docs/membership/coil-extension/index.html'>
            Coil Browser extension
          </Link>{' '}
          to continue.
        </p>
      )}
      {document.monetization?.state === 'pending' && (
        <>
          <p>
            <Spinner />
          </p>
          <p>Loading...</p>
        </>
      )}
      {document.monetization?.state === 'stopped' && (
        <p>
          Something went wrong. Is your Wallet (e.g. Coil wallet) working, and
          do you have a subscription?
        </p>
      )}
    </ContainerNarrow>
  );
}
export default WebMonetizationWrapper;
