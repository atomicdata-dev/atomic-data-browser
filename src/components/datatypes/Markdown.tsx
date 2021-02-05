import React from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  text: string;
};

/** Renders a markdown value */
function Markdown({ text }: Props): JSX.Element {
  return <ReactMarkdown>{text}</ReactMarkdown>;
}

export default Markdown;
