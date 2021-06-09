import React from 'react';
import { useHistory } from 'react-router-dom';
import { newURL } from '../helpers/navigation';
import { useResource, useTitle } from '../atomic-react/hooks';
import { Button } from './Button';
import { FaPlus } from 'react-icons/fa';

type NewIntanceButtonProps = {
  klass: string;
  subtle?: boolean;
  icon?: boolean;
};

/** A button for creating a new instance of some thing */
function NewIntanceButton({ klass, subtle, icon }: NewIntanceButtonProps): JSX.Element {
  const [resource] = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();

  return (
    <Button onClick={() => history.push(newURL(klass))} subtle={subtle} title={`Create a new ${title}`}>
      {icon ? <FaPlus /> : `new ${title}`}
    </Button>
  );
}

export default NewIntanceButton;
