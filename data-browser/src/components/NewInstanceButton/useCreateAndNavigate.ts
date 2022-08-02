import {
  JSONValue,
  properties,
  Resource,
  useResource,
  useStore,
  useTitle,
} from '@tomic/react';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { constructOpenURL } from '../../helpers/navigation';

/**
 * Hook that builds a function that will create a new resoure with the given
 * properties and then navigate to it.
 *
 * @param klass The type of resource to create a new instance of.
 * @param parent The parent resource of the new resource.
 * @returns A createAndNavigate function.
 */
export function useCreateAndNavigate(klass: string, parent: string) {
  const store = useStore();
  const classTypeResource = useResource(klass);
  const title = useTitle(classTypeResource);
  const navigate = useNavigate();

  return useCallback(
    async (
      className: string,
      propVals: Record<string, JSONValue>,
      extraParams?: Record<string, string>,
    ) => {
      const subject = store.createSubject(className);
      const resource = new Resource(subject, true);

      await Promise.all([
        ...Object.entries(propVals).map(([key, val]) =>
          resource.set(key, val, store),
        ),
        resource.set(properties.parent, parent, store),
      ]);

      await resource.save(store);

      navigate(constructOpenURL(subject, extraParams));
      toast.success(`${title} created`);
    },
    [store, classTypeResource, title, navigate, parent],
  );
}
