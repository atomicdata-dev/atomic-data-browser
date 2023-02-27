import { properties, Resource, useNumber, useString } from '@tomic/react';
import { useCallback } from 'react';

export function useFileInfo(resource: Resource) {
  const [downloadUrl] = useString(resource, properties.file.downloadUrl);
  const [mimeType] = useString(resource, properties.file.mimetype);

  const [bytes] = useNumber(resource, properties.file.filesize);

  const downloadFile = useCallback(() => {
    window.open(downloadUrl);
  }, [downloadUrl]);

  return {
    downloadFile,
    downloadUrl,
    bytes,
    mimeType,
  };
}
