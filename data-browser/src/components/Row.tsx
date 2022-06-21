import styled from 'styled-components';
import * as CSS from 'csstype';
import React from 'react';

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: CSS.Property.Gap;
  justify?: CSS.Property.JustifyContent;
  direction?: CSS.Property.FlexDirection;
  center?: boolean;
}

export const Row: React.FC<React.PropsWithChildren<RowProps>> = ({
  children,
  ...props
}) => {
  return <StyledDiv {...props}>{children}</StyledDiv>;
};

const StyledDiv = styled.div<RowProps>`
  align-items: ${p => (p.center ? 'center' : 'initial')};
  display: flex;
  gap: ${p => p.gap ?? `${p.theme.margin}rem`};
  justify-content: ${p => p.justify ?? 'start'};
  flex-direction: ${p => p.direction ?? 'row'};
`;
