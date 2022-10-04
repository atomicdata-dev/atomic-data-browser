import { properties, useString } from '@tomic/react';
import React from 'react';
import styled from 'styled-components';
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
  const [fileUrl] = useString(resource, properties.file.downloadUrl);
  const [mimetype] = useString(resource, properties.file.mimetype);

  if (imageMimeTypes.has(mimetype!)) {
    return (
      <InnerWrapper>
        <Image src={fileUrl} alt='' />
      </InnerWrapper>
    );
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
