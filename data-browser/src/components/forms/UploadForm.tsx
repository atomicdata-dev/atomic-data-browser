import React, { useCallback, useState } from 'react';
import { Resource, uploadFiles, useStore } from '@tomic/react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../Button';
import FilePill from '../FilePill';
import { ErrMessage } from './InputStyles';

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
  const [err, setErr] = useState<Error | undefined>(undefined);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setErr(undefined);
        setIsUploading(true);
        const netUploaded = await uploadFiles(
          acceptedFiles,
          store,
          parentResource.getSubject(),
        );
        const allUploaded = [...uploadedFiles, ...netUploaded];
        setUploadedFiles(allUploaded);
        setIsUploading(false);
      } catch (e) {
        setErr(e);
        setIsUploading(false);
      }
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
            loading={isUploading ? 'Uploading...' : undefined}
          >
            Upload file(s)...
          </Button>
        )}
        {err && <ErrMessage>{err.message}</ErrMessage>}
      </div>
      {uploadedFiles.length > 0 &&
        uploadedFiles.map(fileSubject => (
          <FilePill key={fileSubject} subject={fileSubject} />
        ))}
    </div>
  );
}
