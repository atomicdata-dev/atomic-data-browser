import React, { useCallback, useState } from 'react';
import { Resource, uploadFiles } from '@tomic/lib';
import { useDropzone } from 'react-dropzone';
import { useStore } from '@tomic/react';
import { Button } from '../Button';
import FilePill from '../FilePill';

interface UploadFormProps {
  /**
   * The resource which the newly uploaded files will refer to as parent. In
   * other words, the newly uploaded files will be children of this resource.
   */
  parentResource: Resource;
}

/** Shows a Button + drag and drop interface for uploading files */
export default function UploadForm({
  parentResource,
}: UploadFormProps): JSX.Element {
  const store = useStore();

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true);
      const netUploaded = await uploadFiles(
        acceptedFiles,
        store,
        parentResource.getSubject(),
      );
      const allUploaded = [...uploadedFiles, ...netUploaded];
      setUploadedFiles(allUploaded);
      setIsUploading(false);
    },
    [uploadedFiles, setUploadedFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (parentResource.new) {
    return <p>You can add attachments after saving the resource.</p>;
  }

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>{'Drop the files here ...'}</p>
        ) : (
          <Button
            subtle
            onClick={() => null}
            loading={isUploading && 'Uploading...'}
          >
            Upload file(s)...
          </Button>
        )}
      </div>
      {uploadedFiles.length > 0 &&
        uploadedFiles.map(fileSubject => (
          <FilePill key={fileSubject} subject={fileSubject} />
        ))}
    </div>
  );
}
