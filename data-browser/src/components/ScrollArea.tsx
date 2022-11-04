import React from 'react';
import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import styled from 'styled-components';
import { transparentize } from 'polished';

const SIZE = '0.8rem';

export interface ScrollAreaProps {
  className?: string;
}

export const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ScrollAreaProps>
>(({ children, className }, ref): JSX.Element => {
  return (
    <RadixScrollArea.Root type='scroll'>
      <RadixScrollArea.Viewport className={className} ref={ref}>
        {children}
      </RadixScrollArea.Viewport>
      <ScrollBar orientation='horizontal'>
        <Thumb />
      </ScrollBar>
      <ScrollBar orientation='vertical'>
        <Thumb />
      </ScrollBar>
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  );
});

ScrollArea.displayName = 'ScrollArea';

const ScrollBar = styled(RadixScrollArea.Scrollbar)`
  display: flex;
  /* ensures no selection */
  user-select: none;
  /* disable browser handling of all panning and zooming gestures on touch devices */
  touch-action: none;
  padding: 2px;
  background-color: transparent;
  transition: background-color ${p => p.theme.animation.duration} ease-out;
  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: ${() => SIZE};
  }
`;

const Thumb = styled(RadixScrollArea.Thumb)`
  position: relative;
  bottom: 1px;
  flex: 1;
  background-color: ${p => transparentize(0.25, p.theme.colors.bg2)};
  border-radius: ${() => SIZE};
  backdrop-filter: blur(10px);
  z-index: 2;
`;
