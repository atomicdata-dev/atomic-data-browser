import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useDialog,
} from './Dialog';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useSettings } from '../helpers/AppSettings';
import { Button, ButtonInput } from './Button';
import { Agent, nameRegex, useRegister, useServerURL } from '@tomic/react';
import { FaEyeSlash, FaEye, FaCog } from 'react-icons/fa';
import Field from './forms/Field';
import { InputWrapper, InputStyled } from './forms/InputStyles';
import { Row } from './Row';
import { ErrorLook } from './ErrorLook';
import { CodeBlock } from './CodeBlock';

/**
 * The Guard can be wrapped around a Component that depends on a user being logged in.
 * If the user is not logged in, it will show a button to sign up / sign in.
 * Show to users after a new Agent has been created.
 * Instructs them to save their secret somewhere safe
 */
export function Guard({ children }: React.PropsWithChildren<any>): JSX.Element {
  const { dialogProps, show } = useDialog();
  const { agent } = useSettings();
  const [register, setRegister] = useState(true);

  if (agent) {
    return <>{children}</>;
  } else
    return (
      <>
        <Row>
          <Button
            onClick={() => {
              setRegister(true);
              show();
            }}
          >
            Register
          </Button>
          <Button
            subtle
            onClick={() => {
              setRegister(false);
              show();
            }}
          >
            Sign In
          </Button>
        </Row>
        <Dialog {...dialogProps}>{register ? <Register /> : <SignIn />}</Dialog>
      </>
    );
}

function Register() {
  const [name, setName] = useState('');
  const [secret, setSecret] = useState('');
  const [driveURL, setDriveURL] = useState('');
  const [newAgent, setNewAgent] = useState<Agent | undefined>(undefined);
  const [serverUrlStr] = useServerURL();
  const [err, setErr] = useState<Error | undefined>(undefined);
  const register = useRegister();
  const { setAgent } = useSettings();

  const serverUrl = new URL(serverUrlStr);
  serverUrl.host = `${name}.${serverUrl.host}`;

  useEffect(() => {
    // check regex of name, set error
    if (!name.match(nameRegex)) {
      setErr(new Error('Name must be lowercase and only contain numbers'));
    } else {
      setErr(undefined);
    }
  }, [name]);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!name) {
        setErr(new Error('Name is required'));

        return;
      }

      try {
        const { driveURL: newDriveURL, agent } = await register(name);
        setDriveURL(newDriveURL);
        setSecret(agent.buildSecret());
        setNewAgent(agent);
      } catch (er) {
        setErr(er);
      }
    },
    [name],
  );

  const handleSaveAgent = useCallback(() => {
    setAgent(newAgent);
  }, [newAgent]);

  if (driveURL) {
    return (
      <>
        <DialogTitle>
          <h1>Save your Passphrase, {name}</h1>
        </DialogTitle>
        <DialogContent>
          <p>
            Your Passphrase is like your password. Never share it with anyone.
            Use a password manager to store it securely. You will need this to
            log in next!
          </p>
          <CodeBlock content={secret} wrapContent />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveAgent}>Continue here</Button>
          <a href={driveURL} target='_blank' rel='noreferrer'>
            Open my new Drive!
          </a>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <DialogTitle>
        <h1>Register</h1>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id='register-form'>
          <Field
            label='Unique username'
            helper='Becomes a part of your URL, e.g. `example.atomicdata.dev`'
          >
            <InputWrapper>
              <InputStyled
                autoFocus={true}
                pattern={nameRegex}
                type={'text'}
                required
                value={name}
                onChange={e => {
                  setName(e.target.value);
                }}
              />
            </InputWrapper>
          </Field>
          {!err && name?.length > 0 && <code>{serverUrl.toString()}</code>}
          {name && err && <ErrorLook>{err.message}</ErrorLook>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          type='submit'
          form='register-form'
          disabled={!name || !!err}
          onClick={handleSubmit}
        >
          Create
        </Button>
      </DialogActions>
    </>
  );
}

function SignIn() {
  return (
    <>
      <DialogTitle>
        <h1>Sign in </h1>
      </DialogTitle>
      <DialogContent>
        <SettingsAgent />
        <p>Lost your passphrase?</p>
      </DialogContent>
    </>
  );
}

export const SettingsAgent: React.FunctionComponent = () => {
  const { agent, setAgent } = useSettings();
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [secret, setSecret] = useState<string | undefined>(undefined);

  // When there is an agent, set the advanced values
  // Otherwise, reset the secret value
  React.useEffect(() => {
    if (agent !== undefined) {
      fillAdvanced();
    } else {
      setSecret('');
    }
  }, [agent]);

  // When the key or subject changes, update the secret
  React.useEffect(() => {
    renewSecret();
  }, [subject, privateKey]);

  function renewSecret() {
    if (agent) {
      setSecret(agent.buildSecret());
    }
  }

  function fillAdvanced() {
    try {
      if (!agent) {
        throw new Error('No agent set');
      }

      setSubject(agent.subject);
      setPrivateKey(agent.privateKey);
    } catch (e) {
      const err = new Error('Cannot fill subject and privatekey fields.' + e);
      setError(err);
      setSubject('');
    }
  }

  function setAgentIfChanged(oldAgent: Agent | undefined, newAgent: Agent) {
    if (JSON.stringify(oldAgent) !== JSON.stringify(newAgent)) {
      setAgent(newAgent);
    }
  }

  /** Called when the secret or the subject is updated manually */
  async function handleUpdateSubjectAndKey() {
    renewSecret();
    setError(undefined);

    try {
      const newAgent = new Agent(privateKey!, subject);
      await newAgent.getPublicKey();
      await newAgent.verifyPublicKeyWithServer();

      setAgentIfChanged(agent, newAgent);
    } catch (e) {
      const err = new Error('Invalid Agent' + e);
      setError(err);
    }
  }

  function handleCopy() {
    secret && navigator.clipboard.writeText(secret);
  }

  /** When the Secret updates, parse it and try if the */
  async function handleUpdateSecret(updateSecret: string) {
    setSecret(updateSecret);

    if (updateSecret === '') {
      setSecret('');
      setError(undefined);

      return;
    }

    setError(undefined);

    try {
      const newAgent = Agent.fromSecret(updateSecret);
      setAgentIfChanged(agent, newAgent);
      setPrivateKey(newAgent.privateKey);
      setSubject(newAgent.subject);
      // This will fail and throw if the agent is not public, which is by default
      // await newAgent.checkPublicKey();
    } catch (e) {
      const err = new Error('Invalid secret. ' + e);
      setError(err);
    }
  }

  return (
    <form>
      <Field
        label={agent ? 'Passphrase' : 'Enter your Passphrase'}
        helper={
          "The Agent Passphrase is a secret, long string of characters that encodes both the Subject and the Private Key. You can think of it as a combined username + password. Store it safely, and don't share it with others."
        }
        error={error}
      >
        <InputWrapper>
          <InputStyled
            value={secret}
            onChange={e => handleUpdateSecret(e.target.value)}
            type={showPrivateKey ? 'text' : 'password'}
            disabled={agent !== undefined}
            name='secret'
            id='current-password'
            autoComplete='current-password'
            spellCheck='false'
            placeholder='Paste your Passphrase'
          />
          <ButtonInput
            type='button'
            title={showPrivateKey ? 'Hide secret' : 'Show secret'}
            onClick={() => setShowPrivateKey(!showPrivateKey)}
          >
            {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
          </ButtonInput>
          <ButtonInput
            type='button'
            title={advanced ? 'Hide advanced' : 'Show advanced'}
            onClick={() => setAdvanced(!advanced)}
          >
            <FaCog />
          </ButtonInput>
          {agent && (
            <ButtonInput type='button' onClick={handleCopy}>
              copy
            </ButtonInput>
          )}
        </InputWrapper>
      </Field>
      {advanced ? (
        <React.Fragment>
          <Field
            label='Subject URL'
            helper={
              'The link to your Agent, e.g. https://atomicdata.dev/agents/someAgent'
            }
          >
            <InputWrapper>
              <InputStyled
                disabled={agent !== undefined}
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                  handleUpdateSubjectAndKey();
                }}
              />
            </InputWrapper>
          </Field>
          <Field
            label='Private Key'
            helper={
              'The private key of the Agent, which is a Base64 encoded string.'
            }
          >
            <InputWrapper>
              <InputStyled
                disabled={agent !== undefined}
                type={showPrivateKey ? 'text' : 'password'}
                value={privateKey}
                onChange={e => {
                  setPrivateKey(e.target.value);
                  handleUpdateSubjectAndKey();
                }}
              />
              <ButtonInput
                type='button'
                title={showPrivateKey ? 'Hide private key' : 'Show private key'}
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
              </ButtonInput>
            </InputWrapper>
          </Field>
        </React.Fragment>
      ) : null}
    </form>
  );
};
