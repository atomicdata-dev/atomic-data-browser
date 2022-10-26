import { lighten } from 'polished';
import styled from 'styled-components';
import React from 'react';
import { Details } from './Details';
import { FaExclamationTriangle } from 'react-icons/fa';

export const ErrorLook = styled.span`
  color: ${props => props.theme.colors.alert};
  font-family: monospace;
`;

export interface ErrorBlockProps {
  error: Error;
  showTrace?: boolean;
}

export function ErrorBlock({ error, showTrace }: ErrorBlockProps): JSX.Element {
  return (
    <ErrorLookBig>
      <BiggerText>
        <FaExclamationTriangle />
        Something went wrong
      </BiggerText>
      <Details title={<span>Show Details</span>}>
        <pre>
          <CodeBlock>{error.message}</CodeBlock>
        </pre>
        {showTrace && (
          <>
            <span>Stack trace:</span>
            <pre>
              <CodeBlock>{error.stack}</CodeBlock>
            </pre>
          </>
        )}
      </Details>
    </ErrorLookBig>
  );
}

const ErrorLookBig = styled.div`
  background-color: ${p => lighten(0.4, p.theme.colors.alert)};
  color: ${p => p.theme.colors.alert};
  font-size: 1rem;
  padding: ${p => p.theme.margin}rem;
  border-radius: ${p => p.theme.radius};
  border: 1px solid ${p => lighten(0.2, p.theme.colors.alert)};
`;

const CodeBlock = styled.code`
  white-space: pre-wrap;
  border-radius: ${p => p.theme.radius};
  padding: ${p => p.theme.margin}rem;
  background-color: ${p => p.theme.colors.bg};
`;

const BiggerText = styled.p`
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 1ch;
`;
