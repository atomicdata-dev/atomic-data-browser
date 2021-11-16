import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { paths } from '../routes/paths';
import { Button } from './Button';

/**
 * Button that currently links to the Agent Settings page. Should probably open
 * in a Modal.
 */
export function SignInButton() {
  const history = useHistory();
  return (
    <Button
      type='button'
      onClick={() => history.push(paths.agentSettings)}
      title='Go the the User Settings page'
    >
      Sign in
    </Button>
  );
}
