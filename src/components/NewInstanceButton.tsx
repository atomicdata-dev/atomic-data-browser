import React from 'react';
import { useHistory } from 'react-router-dom';
import { newURL } from '../helpers/navigation';
import { useResource, useTitle } from '../atomic-react/hooks';
import { Button } from './Button';

type NewIntanceButtonProps = {
  klass: string;
  subtle?: boolean;
};

/** A button for creating a new instance of some thing */
function NewIntanceButton({ klass, subtle }: NewIntanceButtonProps): JSX.Element {
  const [resource] = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();

  return (
    <Button onClick={() => history.push(newURL(klass))} subtle={subtle}>
      new {title}
    </Button>
  );
}

export default NewIntanceButton;
