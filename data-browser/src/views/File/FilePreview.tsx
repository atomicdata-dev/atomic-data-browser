import React from 'react';
import { Resource } from '@tomic/react';
import { ImageViewer } from '../../components/ImageViewer';
import { useFileInfo } from '../../hooks/useFile';
import styled from 'styled-components';
import { TextPreview } from './TextPreview';
interface FilePreviewProps {
  resource: Resource;
}

export function FilePreview({ resource }: FilePreviewProps) {
  const { downloadUrl, mimeType } = useFileInfo(resource);

  if (mimeType?.startsWith('image/')) {
    return <StyledImageViewer src={downloadUrl ?? ''} />;
  }

  if (mimeType?.startsWith('video/')) {
    return (
      // Don't know how to get captions here
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video controls width='100%'>
        <source src={downloadUrl} type={mimeType} />
        {"Sorry, your browser doesn't support embedded videos."}
      </video>
    );
  }

  if (mimeType?.startsWith('audio/')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls>
        <source src={downloadUrl} type={mimeType} />
      </audio>
    );
  }

  if (mimeType?.startsWith('text/') || mimeType?.startsWith('application/')) {
    return <TextPreview downloadUrl={downloadUrl ?? ''} mimeType={mimeType} />;
  }

  return <NoPreview>No preview available</NoPreview>;
}

const StyledImageViewer = styled(ImageViewer)`
  width: 100%;
`;

const NoPreview = styled.div`
  display: grid;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.bg2};
  border-radius: ${({ theme }) => theme.radius};
  background-color: ${({ theme }) => theme.colors.bg1};
  height: 8rem;
`;
