import React, { Suspense, useState } from 'react';
import { Resource } from '@tomic/react';
import { ImageViewer } from '../../components/ImageViewer';
import { useFileInfo } from '../../hooks/useFile';
import styled from 'styled-components';
import { TextPreview } from './TextPreview';
import { displayFileSize } from './displayFileSize';
import { Button } from '../../components/Button';
import { isTextFile } from './isTextFile';
import { useFilePreviewSizeLimit } from '../../hooks/useFilePreviewSizeLimit';

const PDFViewer = React.lazy(() => import('../../chunks/PDFViewer'));

interface FilePreviewProps {
  resource: Resource;
}

export function FilePreview({ resource }: FilePreviewProps) {
  const { downloadUrl, mimeType, bytes } = useFileInfo(resource);
  const [ignoreSizeLimit, setIgnoreSizeLimit] = useState(false);
  const fileSizeLimit = useFilePreviewSizeLimit();

  if (bytes > fileSizeLimit && !ignoreSizeLimit) {
    return (
      <SizeWarning bytes={bytes} onClick={() => setIgnoreSizeLimit(true)} />
    );
  }

  if (mimeType.startsWith('image/')) {
    return <StyledImageViewer src={downloadUrl} />;
  }

  if (mimeType.startsWith('video/')) {
    return (
      // Don't know how to get captions here
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video controls width='100%'>
        <source src={downloadUrl} type={mimeType} />
        {"Sorry, your browser doesn't support embedded videos."}
      </video>
    );
  }

  if (mimeType.startsWith('audio/')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls>
        <source src={downloadUrl} type={mimeType} />
      </audio>
    );
  }

  if (isTextFile(mimeType)) {
    return <StyledTextPreview downloadUrl={downloadUrl} mimeType={mimeType} />;
  }

  if (mimeType === 'application/pdf') {
    return (
      <Suspense>
        <PDFViewer url={downloadUrl} />
      </Suspense>
    );
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

const StyledTextPreview = styled(TextPreview)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.bg2};
  background-color: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.margin}rem;
`;

interface SizeWarningProps {
  bytes: number;
  onClick: () => void;
}

function SizeWarning({ bytes, onClick }: SizeWarningProps): JSX.Element {
  const fileSizeLimit = useFilePreviewSizeLimit();

  return (
    <NoPreview>
      <p>
        Preview hidden because the file is larger than{' '}
        {displayFileSize(fileSizeLimit)}.
      </p>
      <p>
        <Button onClick={onClick}>
          Load anyway ({displayFileSize(bytes)})
        </Button>
      </p>
    </NoPreview>
  );
}
