import { Resource, useStore } from '@tomic/react';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export type UseSaveResourceResult = [
  save: (e: React.SyntheticEvent) => void,
  saving: boolean,
  error: Error | null,
];

/**
 * Hook that handles saving a resource that is being edited by a form.
 *
 * @param resource The resource to save.
 * @param onSaveSucces Callback that is called when the resource is saved successfully.
 */
export const useSaveResource = (
  resource: Resource,
  onSaveSucces: () => void = () => void 0,
): UseSaveResourceResult => {
  const store = useStore();
  const [saving, setSaving] = useState(false);
  const [error, setErr] = useState<Error | null>(null);

  const save = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setSaving(true);
      setErr(null);

      try {
        await resource.save(store);
        setSaving(false);
        onSaveSucces();
        toast.success('Resource saved');
      } catch (err) {
        setErr(err);
        setSaving(false);
        toast.error('Could not save resource');
      }
    },
    [resource, store],
  );

  return [save, saving, error];
};
