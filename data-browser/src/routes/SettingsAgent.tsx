import * as React from 'react';
import { FaUser } from 'react-icons/fa';

import { useSettings } from '../helpers/AppSettings';
import { LabelStyled } from '../components/forms/InputStyles';
import { Button } from '../components/Button';
import { Margin } from '../components/Card';
import { ResourceInline } from '../views/ResourceInline';
import { ContainerNarrow } from '../components/Containers';
import { editURL } from '../helpers/navigation';
import { ErrorLook } from '../components/ErrorLook';
import { Guard } from '../components/Guard';
import { useNavigate } from 'react-router';
import { SettingsAgent } from '../components/SettingsAgent';

export function SettingsAgentRoute() {
  const { agent, setAgent } = useSettings();
  const navigate = useNavigate();

  function handleSignOut() {
    if (
      window.confirm(
        "If you sign out, your secret will be removed. If you haven't saved your secret somewhere, you will lose access to this User. Are you sure you want to sign out?",
      )
    ) {
      setAgent(undefined);
    }
  }

  return (
    <ContainerNarrow>
      <h1>User Settings</h1>
      <p>
        An Agent is a user, consisting of a Subject (its URL) and Private Key.
        Together, these can be used to edit data and sign Commits.
      </p>
      <Guard>
        {agent && (
          <>
            {agent?.subject?.includes('localhost') && (
              <p>
                <ErrorLook>Warning:</ErrorLook>
                {
                  "You're using a local Agent, which cannot authenticate on other domains, because its URL does not resolve."
                }
              </p>
            )}
            <LabelStyled>
              <FaUser /> You{"'"}re signed in as
            </LabelStyled>
            <p>
              <ResourceInline subject={agent!.subject!} />
            </p>
            <Button onClick={() => navigate(editURL(agent!.subject!))}>
              Edit profile
            </Button>
            <Margin />
            <SettingsAgent />
            <Button
              subtle
              title='Sign out with current Agent and reset this form'
              onClick={handleSignOut}
              data-test='sign-out'
            >
              sign out
            </Button>
          </>
        )}
      </Guard>
    </ContainerNarrow>
  );
}
