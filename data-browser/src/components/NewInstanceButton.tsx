import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { newURL } from '../helpers/navigation';
import { useResource, useStore, useString, useTitle } from '@tomic/react';
import { Button } from './Button';
import { FaPlus } from 'react-icons/fa';
import { properties } from '@tomic/lib';

type NewIntanceButtonProps = {
  klass: string;
  subtle?: boolean;
  icon?: boolean;
  /** ID of the parent Resource, which will be passed to the form */
  parent?: string;
  children?: ReactNode;
};

/** A button for creating a new instance of some thing */
function NewIntanceButton({
  klass,
  subtle,
  icon,
  parent,
  children,
}: NewIntanceButtonProps): JSX.Element {
  const [resource] = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();
  const store = useStore();
  const [shortname] = useString(resource, properties.shortname);

  if (parent == undefined) {
    // TODO: This is not a permanent solution
    parent = store.getAgent()?.subject;
  }

  return (
    <Button
      onClick={() =>
        history.push(newURL(klass, parent, store.createSubject(shortname)))
      }
      subtle={subtle}
      title={`Create a new ${title}`}
    >
      {icon ? <FaPlus /> : `new ${title}`}
      {children}
    </Button>
  );
}

export default NewIntanceButton;
