import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { newURL } from '../../helpers/navigation';
import { useResource, useStore, useString, useTitle } from '@tomic/react';
import { classes, properties } from '@tomic/lib';
import { NewInstanceButtonProps } from './NewInstanceButtonProps';
import { Base } from './Base';
import { useCreateAndNavigate } from './useCreateAndNavigate';

/** Default handler for the new Instance button. DO NOT USE DIRECTLY. */
export function NewInstanceButtonDefault({
  klass,
  subtle,
  icon,
  parent,
  children,
}: NewInstanceButtonProps): JSX.Element {
  const resource = useResource(klass);
  const title = useTitle(resource);
  const navigate = useNavigate();
  const store = useStore();
  const [shortname] = useString(resource, properties.shortname);

  const createResourceAndNavigate = useCreateAndNavigate(klass, parent);

  const onClick = useCallback(() => {
    switch (klass) {
      case classes.chatRoom: {
        createResourceAndNavigate('chatRoom', {
          [properties.name]: 'New ChatRoom',
          [properties.isA]: [classes.chatRoom],
        });
        break;
      }
      case classes.document: {
        createResourceAndNavigate('documents', {
          [properties.isA]: [classes.document],
        });
        break;
      }
      default: {
        // Opens an `Edit` form with the class and a decent subject name
        navigate(newURL(klass, parent, store.createSubject(shortname)));
      }
    }
  }, [klass, store, parent, createResourceAndNavigate]);

  return (
    <Base onClick={onClick} title={title} icon={icon} subtle={subtle}>
      {children}
    </Base>
  );
}
