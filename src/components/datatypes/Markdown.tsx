import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

type Props = {
  text: string;
};

/** Renders a markdown value */
function Markdown({ text }: Props): JSX.Element {
  return (
    <MarkdownWrapper>
      <ReactMarkdown>{text}</ReactMarkdown>
    </MarkdownWrapper>
  );
}

const MarkdownWrapper = styled.div`
  /* Corrects the margin added by <p> and other HTML elements */
  margin-bottom: -${p => p.theme.margin}rem;
`;

export default Markdown;
