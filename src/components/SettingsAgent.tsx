import * as React from 'react';
import { Button, ButtonInput } from '../components/Button';
import { FieldStyled, InputStyled, InputWrapper, LabelStyled } from '../components/forms/InputStyles';
import { useState } from 'react';
import { Agent, parseSecret } from '../atomic-lib/agent';
import { Card, Margin } from '../components/Card';
import { useSettings } from '../helpers/AppSettings';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ResourceInline from './ResourceInline';
import Field from './forms/Field';

const SettingsAgent: React.FunctionComponent = () => {
  const { agent, setAgent } = useSettings();
  const [subject, setSubject] = useState<string>('');
  const [privateKey, setCurrentPrivateKey] = useState<string>('');
  const [error, setError] = useState<Error>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);

  // When the key or subject changes, update the secret
  React.useEffect(() => {
    if (agent) {
      const secret = buildSecret();
      setSecret(secret);
      try {
        setSubject(agent.subject);
        setCurrentPrivateKey(agent.privateKey);
      } catch (err) {
        setError(err);
        setSubject('');
      }
    }
  }, [subject, privateKey, agent]);

  function handleSave() {
    try {
      const agent = new Agent(privateKey, subject);
      setAgent(agent);
    } catch (e) {
      setError(e);
    }
  }

  function handleReset() {
    if (window.confirm('Sure you want to remove and reset the current Agent?')) {
      setAgent(null);
      setError(null);
      setSecret('');
      setSubject('');
      setCurrentPrivateKey('');
    }
  }

  /** Called when the secret or the subject is updated manually */
  function handleUpdateAgent() {
    handleSave();
    setSecret('');
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
      const agent = parseSecret(updateSecret);
      setAgent(agent);
      setError(null);
      setCurrentPrivateKey(agent.privateKey);
      setSubject(agent.subject);
    } catch (e) {
      setError(e);
    }
  }

  function buildSecret() {
    if (agent && agent.privateKey && agent.subject) {
      const objJsonStr = JSON.stringify(agent);
      return btoa(objJsonStr);
    }
    return '';
  }

  return (
    <Card>
      <h2>Agent</h2>
      <p>
        An Agent is a user, consisting of a Subject (its URL) and Private Key. Together, these can be used to edit data and sign Commits.
        You can host and manage your an Agent by running an <a href='https://github.com/joepio/atomic/tree/master/server'>atomic-server</a>.
        Alternatively, you can use an Invite to get a guest Agent on someone else{"'s"} Atomic Server. The `secret` is a single, long string
        of characters that encodes both the Subject and the Private Key. Store it safely, and don{"'"}t share it with others.
      </p>
      <Field label='Agent Secret' error={error}>
        <InputWrapper>
          <InputStyled value={secret} onChange={e => handleUpdateSecret(e.target.value)} type={showPrivateKey ? 'text' : 'password'} />
          <ButtonInput title={showPrivateKey ? 'Hide secret' : 'Show secret'} onClick={() => setShowPrivateKey(!showPrivateKey)}>
            {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
          </ButtonInput>
          <ButtonInput onClick={handleCopy}>copy</ButtonInput>
        </InputWrapper>
      </Field>
      {advanced ? (
        <React.Fragment>
          <FieldStyled>
            <LabelStyled>Agent Subject URL</LabelStyled>
            <InputWrapper>
              <InputStyled
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                  handleUpdateAgent();
                }}
              />
            </InputWrapper>
          </FieldStyled>
          <FieldStyled>
            <LabelStyled>Private Key</LabelStyled>
            <InputWrapper>
              <InputStyled
                type={showPrivateKey ? 'text' : 'password'}
                value={privateKey}
                onChange={e => {
                  setCurrentPrivateKey(e.target.value);
                  handleUpdateAgent();
                }}
              />
              <ButtonInput
                title={showPrivateKey ? 'Hide private key' : 'Show private key'}
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
              </ButtonInput>
            </InputWrapper>
          </FieldStyled>
        </React.Fragment>
      ) : null}
      {/* <Button onClick={handleSave}>save</Button> */}
      <Button subtle onClick={handleReset}>
        reset
      </Button>
      <Button subtle onClick={() => setAdvanced(!advanced)}>
        {advanced ? 'disable advanced' : 'show advanced'}
      </Button>
      {subject && (
        <>
          <LabelStyled>Current Agent</LabelStyled>
          <ResourceInline subject={subject} />
          <Margin />
        </>
      )}
    </Card>
  );
};

export default SettingsAgent;
