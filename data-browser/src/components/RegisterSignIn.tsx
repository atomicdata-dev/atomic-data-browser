import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useDialog,
} from './Dialog';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useSettings } from '../helpers/AppSettings';
import { Button } from './Button';
import { Agent, nameRegex, useRegister, useServerURL } from '@tomic/react';
import Field from './forms/Field';
import { InputWrapper, InputStyled } from './forms/InputStyles';
import { Row } from './Row';
import { ErrorLook } from './ErrorLook';
import { CodeBlock } from './CodeBlock';
import { SettingsAgent } from './SettingsAgent';

interface RegisterSignInProps {
  // URL where to send the user to after succesful registration
  redirect?: string;
}

/**
 * Two buttons: Register / Sign in.
 * Opens a Dialog / Modal with the appropriate form.
 */
export function RegisterSignIn({
  children,
}: React.PropsWithChildren<RegisterSignInProps>): JSX.Element {
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
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [driveURL, setDriveURL] = useState('');
  const [newAgent, setNewAgent] = useState<Agent | undefined>(undefined);
  const [serverUrlStr] = useServerURL();
  const [nameErr, setErr] = useState<Error | undefined>(undefined);
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
  }, [name, email]);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (!name) {
        setErr(new Error('Name is required'));

        return;
      }

      try {
        const { driveURL: newDriveURL, agent } = await register(name, email);
        setDriveURL(newDriveURL);
        setSecret(agent.buildSecret());
        setNewAgent(agent);
      } catch (er) {
        setErr(er);
      }
    },
    [name, email],
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
            label='Username (must be unique)'
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
          <Field label='E-mail'>
            <InputWrapper>
              <InputStyled
                autoFocus={true}
                // pattern={emailRegex}
                type={'email'}
                required
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
            </InputWrapper>
          </Field>
          {name && nameErr && <ErrorLook>{nameErr.message}</ErrorLook>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          type='submit'
          form='register-form'
          disabled={!name || !!nameErr}
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
