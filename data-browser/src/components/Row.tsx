import styled from 'styled-components';
import * as CSS from 'csstype';
import React from 'react';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: CSS.Property.Gap;
  justify?: CSS.Property.JustifyContent;
  direction?: CSS.Property.FlexDirection;
  center?: boolean;
  wrapItems?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export type RowProps = Omit<FlexProps, 'direction'> & {
  reverse?: boolean;
};
export type ColumnProps = Omit<FlexProps, 'direction'> & {
  reverse?: boolean;
};

export const Row: React.FC<React.PropsWithChildren<RowProps>> = ({
  children,
  reverse,
  ...props
}) => {
  return (
    <Flex {...props} direction={reverse ? 'row-reverse' : 'row'}>
      {children}
    </Flex>
  );
};

export const Column: React.FC<React.PropsWithChildren<ColumnProps>> = ({
  children,
  reverse,
  ...props
}) => {
  return (
    <Flex {...props} direction={reverse ? 'column-reverse' : 'column'}>
      {children}
    </Flex>
  );
};

const Flex = styled.div<FlexProps>`
  align-items: ${p => (p.center ? 'center' : 'initial')};
  display: flex;
  gap: ${p => p.gap ?? `${p.theme.margin}rem`};
  justify-content: ${p => p.justify ?? 'start'};
  flex-direction: ${p => p.direction ?? 'row'};
  flex-wrap: ${p => (p.wrapItems ? 'wrap' : 'no-wrap')};
  width: ${p => (p.fullWidth ? '100%' : 'initial')};
  height: ${p => (p.fullHeight ? '100%' : 'initial')};
`;
