import React from 'react';
import styled from 'styled-components';
import { useFileInfo } from '../../../hooks/useFile';
import { useFilePreviewSizeLimit } from '../../../hooks/useFilePreviewSizeLimit';
import { isTextFile } from '../../File/isTextFile';
import { TextPreview } from '../../File/TextPreview';
import { InnerWrapper } from './components';
import { GridItemViewProps } from './GridItemViewProps';

const imageMimeTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'image/avif',
]);

export function FileGridItem({ resource }: GridItemViewProps): JSX.Element {
  const { downloadUrl, mimeType, bytes } = useFileInfo(resource);
  const previewSizeLimit = useFilePreviewSizeLimit();

  if (bytes >= previewSizeLimit) {
    return <TextWrapper>To large for preview</TextWrapper>;
  }

  if (imageMimeTypes.has(mimeType)) {
    return (
      <InnerWrapper>
        <Image src={downloadUrl} alt='' loading='lazy' />
      </InnerWrapper>
    );
  }

  if (isTextFile(mimeType)) {
    return <StyledTextPreview downloadUrl={downloadUrl} mimeType={mimeType} />;
  }

  return <TextWrapper>No preview available</TextWrapper>;
}

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const TextWrapper = styled(InnerWrapper)`
  display: grid;
  place-items: center;
  color: ${p => p.theme.colors.textLight};
`;

const StyledTextPreview = styled(TextPreview)`
  padding: ${p => p.theme.margin}rem;
  color: ${p => p.theme.colors.textLight};

  &:is(pre) {
    padding: 0;
    padding-inline: ${p => p.theme.margin}rem;
  }
`;
