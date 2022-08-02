import React from 'react';
import styled from 'styled-components';
import { ContainerNarrow } from '../../components/Containers.jsx';
import Markdown from '../../components/datatypes/Markdown.jsx';

export interface BookmarkPreviewProps {
  preview: string;
  error?: boolean;
}

export function BookmarkPreview({
  preview,
  error,
}: BookmarkPreviewProps): JSX.Element {
  if (error) {
    return <ErrorPage />;
  }

  return (
    <StyledContainerNarrow>
      <Markdown renderGFM text={preview} />
    </StyledContainerNarrow>
  );
}

const ErrorPage = () => {
  return (
    <StyledError>
      <p>Could not load preview 😞</p>
    </StyledError>
  );
};

const StyledError = styled.div`
  display: grid;
  height: min(80vh, 1000px);
  width: 100%;
  place-items: center;
  font-size: calc(clamp(1rem, 5vw, 2.4rem) + 0.1rem);
`;

const StyledContainerNarrow = styled(ContainerNarrow)`
  max-width: 85ch;
`;
