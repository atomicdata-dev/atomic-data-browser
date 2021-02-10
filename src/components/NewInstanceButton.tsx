import React from 'react';
import { useHistory } from 'react-router-dom';
import { createInstanceUrl } from '../helpers/navigation';
import { useResource, useTitle } from '../lib/react';
import { ButtonMargin } from './Button';

type NewIntanceButtonProps = {
  klass: string;
};

/** A button for creating a new instance of some thing */
function NewIntanceButton({ klass }: NewIntanceButtonProps): JSX.Element {
  const [resource] = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();

  return (
    <ButtonMargin type='button' onClick={() => history.push(createInstanceUrl(klass))}>
      Create a {title}
    </ButtonMargin>
  );
}

export default NewIntanceButton;
