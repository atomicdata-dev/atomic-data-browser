import React, { ReactNode, useCallback } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { newURL, openURL } from '../helpers/navigation';
import {
  useCurrentAgent,
  useResource,
  useStore,
  useString,
  useTitle,
} from '@tomic/react';
import { Button } from './Button';
import { FaPlus } from 'react-icons/fa';
import { classes, JSONValue, properties, Resource, Store } from '@tomic/lib';
import toast from 'react-hot-toast';
import { paths } from '../routes/paths';

type NewIntanceButtonProps = {
  klass: string;
  subtle?: boolean;
  icon?: boolean;
  /** ID of the parent Resource, which will be passed to the form */
  parent?: string;
  children?: ReactNode;
};

// resource.set(properties.name, 'New ChatRoom', store),
// resource.set(properties.isA, [classes.chatRoom], store),;

function createClickHandler(
  store: Store,
  parent: string,
  title: string,
  navigate: NavigateFunction,
) {
  return async (className: string, propVals: Record<string, JSONValue>) => {
    const subject = store.createSubject(className);
    const resource = new Resource(subject, true);

    await Promise.all([
      ...Object.entries(propVals).map(([key, val]) =>
        resource.set(key, val, store),
      ),
      resource.set(properties.parent, parent, store),
    ]);

    await resource.save(store);

    navigate(openURL(subject));
    toast.success(`${title} created`);
  };
}

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
  const navigate = useNavigate();
  const store = useStore();
  const [agent] = useCurrentAgent();
  const [shortname] = useString(resource, properties.shortname);

  if (parent == undefined) {
    // TODO: This is not a permanent solution
    parent = store.getAgent()?.subject;
  }

  const onClick = useCallback(async () => {
    if (!agent) {
      toast.error('You need to be logged in to create new things');
      navigate(paths.agentSettings);
      return;
    }

    const handleClick = createClickHandler(store, parent, title, navigate);
    switch (klass) {
      case classes.chatRoom: {
        handleClick('chatRoom', {
          [properties.name]: 'New ChatRoom',
          [properties.isA]: [classes.chatRoom],
        });
        break;
      }
      case classes.document: {
        handleClick('documents', {
          [properties.isA]: [classes.document],
        });
        break;
      }
      case classes.bookmark: {
        handleClick('bookmark', {
          [properties.name]: 'New Bookmark',
          [properties.bookmark.url]: 'https://example.com',
          [properties.isA]: [classes.bookmark],
        });
        break;
      }
      default: {
        // Opens an `Edit` form with the class and a decent subject name
        navigate(newURL(klass, parent, store.createSubject(shortname)));
      }
    }
  }, [klass, store, parent, agent]);

  return (
    <Button
      onClick={onClick}
      subtle={subtle}
      title={agent ? `Create a new ${title}` : 'No User set - sign in first'}
    >
      {icon ? <FaPlus /> : `new ${title}`}
      {children}
    </Button>
  );
}

export default NewIntanceButton;
