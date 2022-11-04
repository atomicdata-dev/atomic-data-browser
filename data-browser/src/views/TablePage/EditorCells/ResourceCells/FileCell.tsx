import { properties, useString, useTitle } from '@tomic/react';
import React from 'react';
import { FaFile } from 'react-icons/fa';
import styled from 'styled-components';
import { ResourceCellProps } from '../Type';
import { SimpleResourceLink } from './SimpleResourceLink';

const validMimeTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/vnd.microsoft.icon',
  'image/vnd.adobe.photoshop',
  'image/heic',
  'image/heif',
  'image/heif-sequence',
  'image/heic-sequence',
  'image/avif',
  'image/avif-sequence',
]);

export function FileCell({ resource }: ResourceCellProps) {
  const [title] = useTitle(resource);
  const [mimeType] = useString(resource, properties.file.mimetype);
  const [downloadUrl] = useString(resource, properties.file.downloadUrl);

  const isImage = validMimeTypes.has(mimeType ?? '');

  return (
    <StyledLink resource={resource}>
      {isImage ? (
        <img src={downloadUrl} alt={title} loading='lazy' />
      ) : (
        <FaFile />
      )}
      {title}
    </StyledLink>
  );
}

const StyledLink = styled(SimpleResourceLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  img {
    width: calc(var(--table-row-height) - 6px);
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 5px;
  }
`;
