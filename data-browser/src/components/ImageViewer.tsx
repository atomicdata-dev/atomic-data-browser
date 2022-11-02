import React, { useState } from 'react';

import styled from 'styled-components';

/** Shows an image that becomes fullscreen on click */
export function ImageViewer(props): JSX.Element {
  const [showFull, setShowFull] = useState(false);

  return (
    <ImageViewerStyled
      data-test={`image-viewer`}
      onClick={() => setShowFull(!showFull)}
      {...props}
      showFull={showFull}
    />
  );
}

interface Props {
  showFull: boolean;
}

const ImageViewerStyled = styled.img<Props>`
  max-width: 100%;
  max-height: 100%;
  position: ${t => (t.showFull ? 'fixed' : 'relative')};
  cursor: ${t => (t.showFull ? 'zoom-out' : 'zoom-in')};
  width: ${t => (t.showFull ? '100%' : 'auto')};
  z-index: ${t => (t.showFull ? '100' : 'auto')};
  object-fit: contain;
  /* Depends on navbarheight */
  /* top: ${t => (t.showFull ? '2.5rem' : '0')}; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${t => t.theme.colors.bg};
`;
