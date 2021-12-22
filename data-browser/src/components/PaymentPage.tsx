import React, { useEffect, useState } from 'react';
import { properties, Resource } from '@tomic/lib';
import { Helmet } from 'react-helmet';
import { ContainerNarrow } from './Containers';
import { useString, useTitle } from '@tomic/react';
import 'types-wm';
import Spinner from './Button';

type Props = {
  resource: Resource;
};

/** Returns true if the user is paying */
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
 * Is shown when Payment is required to access page. Instructs the user to
 * install Coil. Shows progress and errors.
 */
function PaymentPage({ resource }: Props): JSX.Element {
  const [paymentPointer] = useString(resource, properties.paymentPointer);
  const title = useTitle(resource);

  return (
    <ContainerNarrow>
      <h1>{title}</h1>
      <Helmet>
        <meta name='monetization' content={paymentPointer} />
      </Helmet>
      <p>This content can only be accessed through Webmonetization.</p>
      {document.monetization == undefined && (
        <p>
          Get the{' '}
          <a href='https://help.coil.com/docs/membership/coil-extension/index.html'>
            Coil Browser extension
          </a>{' '}
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
        <p>Something went wrong.</p>
      )}
    </ContainerNarrow>
  );
}
export default PaymentPage;
