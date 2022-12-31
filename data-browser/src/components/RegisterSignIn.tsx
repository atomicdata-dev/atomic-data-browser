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
import { nameRegex, register, useServerURL, useStore } from '@tomic/react';
import Field from './forms/Field';
import { InputWrapper, InputStyled } from './forms/InputStyles';
import { Row } from './Row';
import { ErrorLook } from './ErrorLook';
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
  const { dialogProps, show, close } = useDialog();
  const { agent } = useSettings();
  const [isRegistering, setRegister] = useState(true);

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
        <Dialog {...dialogProps}>
          {isRegistering ? <Register close={close} /> : <SignIn />}
        </Dialog>
      </>
    );
}

function Register({ close }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [serverUrlStr] = useServerURL();
  const [nameErr, setErr] = useState<Error | undefined>(undefined);
  const store = useStore();
  const [mailSent, setMailSent] = useState(false);

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
        await register(store, name, email);
        setMailSent(true);
      } catch (er) {
        setErr(er);
      }
    },
    [name, email],
  );

  if (mailSent) {
    return (
      <>
        <DialogTitle>
          <h1>Go to your email inbox</h1>
        </DialogTitle>
        <DialogContent>
          <p>
            {"We've sent a confirmation link to "}
            <strong>{email}</strong>
            {'.'}
          </p>
          <p>Your account will be created when you open that link.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>Ok, I will!</Button>
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
      </DialogContent>
      <DialogActions>
        <p>Lost your passphrase?</p>
      </DialogActions>
    </>
  );
}
