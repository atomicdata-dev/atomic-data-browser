import React from 'react';
import { useHistory } from 'react-router-dom';
import { newURL } from '../helpers/navigation';
import { useResource, useTitle } from '../atomic-react/hooks';
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
    <ButtonMargin type='button' onClick={() => history.push(newURL(klass))}>
      new {title}
    </ButtonMargin>
  );
}

export default NewIntanceButton;
