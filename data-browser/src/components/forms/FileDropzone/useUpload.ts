import {
  properties,
  Resource,
  uploadFiles,
  useArray,
  useStore,
} from '@tomic/react';
import { useCallback, useState } from 'react';

export interface UseUploadResult {
  /** Uploads files to the upload endpoint and returns the created subjects. */
  upload: (acceptedFiles: File[]) => Promise<string[]>;
  isUploading: boolean;
  error: Error | undefined;
}

export function useUpload(parentResource: Resource): UseUploadResult {
  const store = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [subResources, setSubResources] = useArray(
    parentResource,
    properties.subResources,
  );

  const upload = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setError(undefined);
        setIsUploading(true);
        const netUploaded = await uploadFiles(
          acceptedFiles,
          store,
          parentResource.getSubject(),
        );
        const allUploaded = [...netUploaded];
        setIsUploading(false);
        setSubResources([...subResources, ...allUploaded]);

        return allUploaded;
      } catch (e) {
        setError(e);
        setIsUploading(false);

        return [];
      }
    },
    [parentResource],
  );

  return {
    upload,
    isUploading,
    error,
  };
}
