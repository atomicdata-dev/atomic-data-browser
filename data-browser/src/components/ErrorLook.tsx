import { lighten } from 'polished';
import styled from 'styled-components';
import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Column } from './Row';

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
      <Column>
        <CodeBlock>{error.message}</CodeBlock>
        {showTrace && (
          <>
            Stack trace:
            <CodeBlock
              style={{
                maxHeight: '10rem',
              }}
            >
              {error.stack}
            </CodeBlock>
          </>
        )}
      </Column>
    </ErrorLookBig>
  );
}

const ErrorLookBig = styled.div`
  color: ${p => p.theme.colors.alert};
  font-size: 1rem;
  padding: ${p => p.theme.margin}rem;
  border-radius: ${p => p.theme.radius};
  border: 1px solid ${p => lighten(0.2, p.theme.colors.alert)};
  background-color: ${p => p.theme.colors.bg1};
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
