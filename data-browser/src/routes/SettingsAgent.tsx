import * as React from 'react';
import { useState } from 'react';
import { Agent } from '@tomic/lib';
import { FaCog, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { useSettings } from '../helpers/AppSettings';
import {
  InputStyled,
  InputWrapper,
  LabelStyled,
} from '../components/forms/InputStyles';
import { ButtonInput, Button } from '../components/Button';
import { Margin } from '../components/Card';
import Field from '../components/forms/Field';
import ResourceInline from '../components/ResourceInline';
import { ContainerNarrow } from '../components/Containers';

const SettingsAgent: React.FunctionComponent = () => {
  const { agent, setAgent } = useSettings();
  const [subject, setSubject] = useState<string>('');
  const [privateKey, setCurrentPrivateKey] = useState<string>('');
  const [error, setError] = useState<Error>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [secret, setSecret] = useState<string>('');

  // When there is an agent, set the advanced values
  // Otherwise, reset the secret value
  React.useEffect(() => {
    if (agent !== null) {
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
      const secret = agent.buildSecret();
      setSecret(secret);
    }
  }

  function fillAdvanced() {
    try {
      setSubject(agent.subject);
      setCurrentPrivateKey(agent.privateKey);
    } catch (e) {
      const err = new Error('Cannot fill subject and privatekey fields.' + e);
      setError(err);
      setSubject('');
    }
  }

  async function handleSave() {
    try {
      const agent = new Agent(privateKey, subject);
      await agent.getPublicKey();
      setAgent(agent);
    } catch (e) {
      const err = new Error('Invalid Agent' + e);
      setError(err);
      setAgent(null);
    }
  }

  function handleSignOut() {
    if (
      window.confirm('Sure you want to remove and reset the current Agent?')
    ) {
      setAgent(null);
      setError(null);
      setSubject('');
      setCurrentPrivateKey('');
    }
  }

  /** Called when the secret or the subject is updated manually */
  function handleUpdateAgent() {
    renewSecret();
    setError(null);
    handleSave();
  }

  function handleCopy() {
    navigator.clipboard.writeText(secret);
  }

  function handleUpdateSecret(updateSecret: string) {
    setSecret(updateSecret);
    if (updateSecret == '') {
      setSecret('');
      setError(null);
      return;
    }
    try {
      const agent = Agent.fromSecret(updateSecret);
      setAgent(agent);
      setError(null);
      setCurrentPrivateKey(agent.privateKey);
      setSubject(agent.subject);
    } catch (e) {
      const err = new Error('Invalid secret. ' + e);
      setError(err);
    }
  }

  return (
    <ContainerNarrow>
      <form>
        <h1>User Settings</h1>
        <p>
          An Agent is a user, consisting of a Subject (its URL) and Private Key.
          Together, these can be used to edit data and sign Commits.
        </p>
        {agent ? (
          <>
            <LabelStyled>
              <FaUser /> You{"'"}re signed in as
            </LabelStyled>
            <ResourceInline subject={agent.subject} />
            <Margin />
          </>
        ) : (
          <p>
            You can create your own Agent by hosting an{' '}
            <a href='https://github.com/joepio/atomic/tree/master/server'>
              atomic-server
            </a>
            . Alternatively, you can use an Invite to get a guest Agent on
            someone else{"'s"} Atomic Server.
          </p>
        )}
        <Field
          label={agent ? 'Agent Secret' : 'Enter your Agent Secret'}
          helper={
            "The Agent Secret is a long string of characters that encodes both the Subject and the Private Key. You can think of it as a combined username + password. Store it safely, and don't share it with others."
          }
          error={error}
        >
          <InputWrapper>
            <InputStyled
              value={secret}
              onChange={e => handleUpdateSecret(e.target.value)}
              type={showPrivateKey ? 'text' : 'password'}
              disabled={agent !== null}
              name='secret'
              id='current-password'
              autoComplete='current-password'
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
              error={error}
            >
              <InputWrapper>
                <InputStyled
                  disabled={agent !== null}
                  value={subject}
                  onChange={e => {
                    setSubject(e.target.value);
                    handleUpdateAgent();
                  }}
                />
              </InputWrapper>
            </Field>
            <Field
              label='Private Key'
              helper={
                'The private key of the Agent, which is a Base64 encoded string.'
              }
              error={error}
            >
              <InputWrapper>
                <InputStyled
                  disabled={agent !== null}
                  type={showPrivateKey ? 'text' : 'password'}
                  value={privateKey}
                  onChange={e => {
                    setCurrentPrivateKey(e.target.value);
                    handleUpdateAgent();
                  }}
                />
                <ButtonInput
                  type='button'
                  title={
                    showPrivateKey ? 'Hide private key' : 'Show private key'
                  }
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
                </ButtonInput>
              </InputWrapper>
            </Field>
          </React.Fragment>
        ) : null}
        {agent && (
          <Button
            subtle
            title='Sign out with current Agent and reset this form'
            onClick={handleSignOut}
          >
            sign out
          </Button>
        )}
      </form>
    </ContainerNarrow>
  );
};

export default SettingsAgent;
