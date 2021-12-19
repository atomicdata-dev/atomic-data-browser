import { properties, Resource } from '@tomic/lib';
import { useNumber, useString, useTitle } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { ContainerNarrow } from '../components/Containers';
import { ValueForm } from '../components/forms/ValueForm';
import { ImageViewer } from '../components/ImageViewer';
import Parent from '../components/Parent';

interface FilePageProps {
  resource: Resource;
}

/** Full page File resource for showing and downloading files */
export function FilePage({ resource }: FilePageProps) {
  const title = useTitle(resource);

  return (
    <ContainerNarrow about={resource.getSubject()}>
      <Parent resource={resource} />
      <h1>{title}</h1>
      <FileInner resource={resource} />
    </ContainerNarrow>
  );
}

/** A preview + download button for a file */
export function FileInner({ resource }: FilePageProps) {
  function handleDownload() {
    window.open(downloadUrl);
  }

  const [downloadUrl] = useString(resource, properties.file.downloadUrl);
  const [bytes] = useNumber(resource, properties.file.filesize);

  const fileSizeString = bytes ? ` (${niceBytes(bytes)})` : '';

  return (
    <div>
      <ValueForm resource={resource} propertyURL={properties.description} />
      <Button onClick={handleDownload}>Download{fileSizeString}</Button>
      <div>
        <FilePreview resource={resource} />
      </div>
    </div>
  );
}

function FilePreview({ resource }: FilePageProps) {
  const [url] = useString(resource, properties.file.downloadUrl);
  const [mime] = useString(resource, properties.file.mimetype);
  if (mime?.startsWith('image/')) {
    return <ImageViewer src={url} />;
  }
  if (mime?.startsWith('video/')) {
    return (
      <video controls width='100%'>
        <source src={url} type={mime} />
        {"Sorry, your browser doesn't support embedded videos."}
      </video>
    );
  }
  return <div>No preview available</div>;
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function niceBytes(n: number) {
  let l = 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
}
