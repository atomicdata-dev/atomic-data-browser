import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import Markdown from '../../components/datatypes/Markdown';

interface TextPreviewProps {
  downloadUrl: string;
  mimeType: string;
}

const fetchFile = async (
  url: string,
  signal: AbortSignal,
  mimeType: string,
) => {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: mimeType,
    },
    signal,
  });

  return res.text();
};

export function TextPreview({
  downloadUrl,
  mimeType,
}: TextPreviewProps): JSX.Element {
  const [data, setData] = useState('');

  useEffect(() => {
    const abortController = new AbortController();

    fetchFile(downloadUrl, abortController.signal, mimeType).then(res =>
      setData(res),
    );

    return () => abortController.abort();
  }, [downloadUrl]);

  if (mimeType === 'text/markdown') {
    return (
      <MarkdownWrapper>
        <Markdown text={data} />
      </MarkdownWrapper>
    );
  }

  return <Wrapper>{data}</Wrapper>;
}

const textFileSurface = css`
  width: min(90ch, 100%);
  border: 1px solid ${({ theme }) => theme.colors.bg2};
  background-color: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius};
  padding: ${({ theme }) => theme.margin}rem;
  position: relative;
`;

const MarkdownWrapper = styled.div`
  ${textFileSurface}
`;

const Wrapper = styled.pre`
  ${textFileSurface}
  white-space: pre-wrap;
`;
