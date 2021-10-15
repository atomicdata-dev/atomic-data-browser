import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

type Props = {
  text: string;
  /**
   * By default, all bottom Markdown elements have some margin (e.g. the last
   * paragraph). If you set noMargin, this is corrected.
   */
  noMargin?: boolean;
};

/** Renders a markdown value */
function Markdown({ text, noMargin }: Props): JSX.Element {
  return (
    <MarkdownWrapper noMargin={noMargin}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </MarkdownWrapper>
  );
}

interface MarkdownWrapperProps {
  noMargin?: boolean;
}

const MarkdownWrapper = styled.div<MarkdownWrapperProps>`
  /* Corrects the margin added by <p> and other HTML elements */
  margin-bottom: -${p => (p.noMargin ? p.theme.margin : 0)}rem;

  img {
    max-width: 100%;
  }
`;

export default Markdown;
