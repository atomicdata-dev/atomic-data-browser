import React from 'react';
import { useHistory } from 'react-router-dom';
import { newURL } from '../helpers/navigation';
import { useResource, useTitle } from '@tomic/react';
import { Button } from './Button';
import { FaPlus } from 'react-icons/fa';

type NewIntanceButtonProps = {
  klass: string;
  subtle?: boolean;
  icon?: boolean;
  /** ID of the parent Resource, which will be passed to the form */
  parent?: string;
};

/** A button for creating a new instance of some thing */
function NewIntanceButton({ klass, subtle, icon, parent }: NewIntanceButtonProps): JSX.Element {
  const [resource] = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();

  return (
    <Button onClick={() => history.push(newURL(klass, parent))} subtle={subtle} title={`Create a new ${title}`}>
      {icon ? <FaPlus /> : `new ${title}`}
    </Button>
  );
}

export default NewIntanceButton;
