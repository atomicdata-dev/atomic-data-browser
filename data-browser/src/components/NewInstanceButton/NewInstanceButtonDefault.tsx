import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { newURL } from '../../helpers/navigation';
import { useResource, useStore, useString, useTitle } from '@tomic/react';
import { classes, properties } from '@tomic/react';
import { NewInstanceButtonProps } from './NewInstanceButtonProps';
import { Base } from './Base';
import { useCreateAndNavigate } from './useCreateAndNavigate';
import { useSettings } from '../../helpers/AppSettings';

/** Default handler for the new Instance button. DO NOT USE DIRECTLY. */
export function NewInstanceButtonDefault({
  klass,
  subtle,
  icon,
  parent,
  children,
  label,
}: NewInstanceButtonProps): JSX.Element {
  const classResource = useResource(klass);
  const [title] = useTitle(classResource);
  const navigate = useNavigate();
  const store = useStore();
  const [shortname] = useString(classResource, properties.shortname);
  const { setDrive } = useSettings();
  const createResourceAndNavigate = useCreateAndNavigate(klass, parent);

  const onClick = useCallback(async () => {
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

      case classes.importer: {
        createResourceAndNavigate('importer', {
          [properties.isA]: [classes.importer],
        });
        break;
      }

      case classes.drive: {
        const newResource = await createResourceAndNavigate(
          'drive',
          {
            [properties.isA]: [classes.drive],
            [properties.write]: [store.getAgent().subject],
            [properties.read]: [store.getAgent().subject],
            // [properties.parent]: null,
          },
          undefined,
          true,
        );
        const agent = await store.getResourceAsync(store.getAgent().subject);
        agent.pushPropVal(properties.drives, newResource.getSubject());
        agent.save(store);
        setDrive(newResource.getSubject());
        break;
      }

      default: {
        // Opens an `Edit` form with the class and a decent subject name
        navigate(newURL(klass, parent, store.createSubject(shortname)));
      }
    }
  }, [klass, store, parent, createResourceAndNavigate]);

  return (
    <Base
      onClick={onClick}
      title={title}
      icon={icon}
      subtle={subtle}
      label={label}
    >
      {children}
    </Base>
  );
}
