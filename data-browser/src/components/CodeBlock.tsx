import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaCopy } from 'react-icons/fa';
import styled from 'styled-components';
import { Button } from './Button';

interface CodeBlockProps {
  content: string;
  loading?: boolean;
}

export function CodeBlock({ content, loading }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(null);

  function copyToClipboard() {
    setIsCopied(content);
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  }

  return (
    <CodeBlockStyled data-code-content={content}>
      {loading ? (
        'loading...'
      ) : (
        <>
          {content}
          <Button
            subtle
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              margin: 0,
              right: 0,
            }}
            onClick={copyToClipboard}
            title={isCopied == content ? 'Copied!' : 'Copy to clipboard'}
            data-test='copy-response'
          >
            {isCopied == content ? <FaCheck /> : <FaCopy />}
          </Button>
        </>
      )}
    </CodeBlockStyled>
  );
}

export const CodeBlockStyled = styled.pre`
  position: relative;
  background-color: ${p => p.theme.colors.bg1};
  border-radius: ${p => p.theme.radius};
  border: solid 1px ${p => p.theme.colors.bg2};
  padding: 0.3rem;
  font-family: monospace;
  width: 100%;
  overflow-x: auto;
`;
