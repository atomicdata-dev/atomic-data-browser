import {
  classes,
  properties,
  useResource,
  useStore,
  useString,
} from '@tomic/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../helpers/AppSettings';
import { newURL } from '../../helpers/navigation';
import { useCreateAndNavigate } from './useCreateAndNavigate';

export function useDefaultNewInstanceHandler(klass: string, parent?: string) {
  const store = useStore();
  const { setDrive } = useSettings();
  const navigate = useNavigate();

  const classResource = useResource(klass);
  const [shortname] = useString(classResource, properties.shortname);

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
          [properties.name]: 'Untitled Document',
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
        const agent = store.getAgent();

        if (!agent || agent.subject === undefined) {
          throw new Error(
            'No agent set in the Store, required when creating a Drive',
          );
        }

        const newResource = await createResourceAndNavigate(
          'drive',
          {
            [properties.isA]: [classes.drive],
            [properties.write]: [agent.subject],
            [properties.read]: [agent.subject],
          },
          undefined,
          true,
        );

        const agentResource = await store.getResourceAsync(agent.subject);
        agentResource.pushPropVal(properties.drives, newResource.getSubject());
        agentResource.save(store);
        setDrive(newResource.getSubject());
        break;
      }

      default: {
        // Opens an `Edit` form with the class and a decent subject name
        navigate(newURL(klass, parent, store.createSubject(shortname)));
      }
    }
  }, [klass, store, parent, createResourceAndNavigate]);

  return onClick;
}
