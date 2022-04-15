import React, { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { newURL, openURL } from '../helpers/navigation';
import { useResource, useStore, useString, useTitle } from '@tomic/react';
import { Button } from './Button';
import { FaPlus } from 'react-icons/fa';
import { classes, properties, Resource } from '@tomic/lib';

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
  const resource = useResource(klass);
  const title = useTitle(resource);
  const history = useHistory();
  const store = useStore();
  const [shortname] = useString(resource, properties.shortname);

  if (parent == undefined) {
    // TODO: This is not a permanent solution
    parent = store.getAgent()?.subject;
  }

  let onClick = async function onClick() {
    // Opens an `Edit` form with the class and a decent subject name
    history.push(newURL(klass, parent, store.createSubject(shortname)));
  };

  switch (klass) {
    case classes.chatRoom: {
      onClick = async () => {
        const subject = store.createSubject('chatRoom');
        const resource = new Resource(subject, true);
        await Promise.all([
          resource.set(properties.name, 'New ChatRoom', store),
          resource.set(properties.isA, [classes.chatRoom], store),
          resource.set(properties.parent, parent, store),
        ]);
        await resource.save(store);
        history.push(openURL(subject));
      };
      break;
    }
    case classes.document: {
      onClick = async () => {
        const subject = store.createSubject('documents');
        const resource = new Resource(subject, true);
        await Promise.all([
          resource.set(properties.name, 'New Document', store),
          resource.set(properties.isA, [classes.document], store),
          resource.set(properties.parent, parent, store),
        ]);
        await resource.save(store);
        history.push(openURL(subject));
      };
    }
  }

  return (
    <Button onClick={onClick} subtle={subtle} title={`Create a new ${title}`}>
      {icon ? <FaPlus /> : `new ${title}`}
      {children}
    </Button>
  );
}

export default NewIntanceButton;
