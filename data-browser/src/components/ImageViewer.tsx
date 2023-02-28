import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHotkeys } from 'react-hotkeys-hook';

import styled from 'styled-components';
import { DialogPortalContext } from './Dialog/dialogContext';

interface ImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
}

/** Shows an image that becomes fullscreen on click */
export function ImageViewer({
  src,
  alt,
  className,
}: ImageViewerProps): JSX.Element {
  const [showFull, setShowFull] = useState(false);
  const portalRef = useContext(DialogPortalContext);

  useHotkeys('esc', () => setShowFull(false), { enabled: showFull });

  if (!portalRef.current) {
    return <></>;
  }

  return (
    <WrapperButton
      showFull={showFull}
      title='Click to enlarge'
      onClick={() => setShowFull(prev => !prev)}
    >
      {!showFull && (
        <img
          src={src}
          alt={alt ?? ''}
          className={className}
          data-test={`image-viewer`}
        />
      )}
      {showFull &&
        createPortal(
          <Viewer>
            <img src={src} alt={alt ?? ''} data-test={`image-viewer`} />
          </Viewer>,
          portalRef.current,
        )}
    </WrapperButton>
  );
}

interface WrapperProps {
  showFull: boolean;
}

const WrapperButton = styled.button<WrapperProps>`
  cursor: ${t => (t.showFull ? 'zoom-out' : 'zoom-in')};
  border: none;
  padding: 0;
  width: fit-content;
  height: fit-content;
  user-select: none;
  border-radius: ${p => p.theme.radius};
  background-color: transparent;

  &:hover,
  &:focus {
    outline: 2px solid ${p => p.theme.colors.main};
  }

  & img {
    border-radius: ${p => p.theme.radius};
    vertical-align: sub;
  }
`;

const Viewer = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100%;
  max-height: 100vh;
  max-height: 100dvh;
  display: grid;
  place-items: center;
  padding: ${p => p.theme.margin}rem;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.85);
  cursor: zoom-out;
  backdrop-filter: blur(5px);

  & img {
    height: 90%;
    max-width: 100%;
    max-height: 100vh;
    object-fit: contain;
    border-radius: ${p => p.theme.radius};
  }
`;
