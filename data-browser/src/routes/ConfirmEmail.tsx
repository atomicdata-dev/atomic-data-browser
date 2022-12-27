import { confirmEmail, useStore } from '@tomic/react';
import * as React from 'react';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { ContainerNarrow } from '../components/Containers';
import { isDev } from '../config';
import { useSettings } from '../helpers/AppSettings';
import { handleError } from '../helpers/handlers';
import {
  useCurrentSubject,
  useSubjectParam,
} from '../helpers/useCurrentSubject';
import { paths } from './paths';

/** Route that connects to `/confirm-email`, which confirms an email and creates a secret key. */
const ConfirmEmail: React.FunctionComponent = () => {
  // Value shown in navbar, after Submitting
  const [subject] = useCurrentSubject();
  const [secret, setSecret] = useState('');
  const store = useStore();
  const [token] = useSubjectParam('token');
  const { agent, setAgent } = useSettings();
  const [destinationToGo, setDestination] = useState<string>();

  const handleConfirm = async () => {
    let tokenUrl = subject as string;

    if (isDev()) {
      const url = new URL(store.getServerUrl());
      url.pathname = paths.confirmEmail;
      url.searchParams.set('token', token as string);
      tokenUrl = url.href;
    }

    try {
      const { agent: newAgent, destination } = await confirmEmail(
        store,
        tokenUrl,
      );
      setAgent(newAgent);
      setSecret(newAgent.buildSecret());
      setDestination(destination);
    } catch (e) {
      handleError(e);
    }
  };

  if (!agent) {
    return (
      <ContainerNarrow>
        <button onClick={handleConfirm}>confirm</button>
      </ContainerNarrow>
    );
  }

  return (
    <ContainerNarrow>
      <h1>Save your Passphrase</h1>
      <p>
        Your Passphrase is like your password. Never share it with anyone. Use a
        password manager to store it securely. You will need this to log in
        next!
      </p>
      <CodeBlock content={secret} wrapContent />
      {/* <Button onClick={handleGoToDestination}>Continue here</Button> */}
      <a href={destinationToGo} target='_blank' rel='noreferrer'>
        Open my new Drive!
      </a>
    </ContainerNarrow>
  );
};

export default ConfirmEmail;
