import React, { useCallback, useContext, useEffect } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import styled, { keyframes } from 'styled-components';
import { transparentize } from 'polished';
import { useDialogTreeContext } from './Dialog/dialogContext';
import { useControlLock } from '../hooks/useControlLock';

export interface PopoverProps {
  Trigger: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  noArrow?: boolean;
}

export function Popover({
  children,
  className,
  open,
  defaultOpen,
  noArrow,
  onOpenChange,
  Trigger,
}: React.PropsWithChildren<PopoverProps>): JSX.Element {
  const { setHasOpenInnerPopup } = useDialogTreeContext();
  const containerRef = useContext(PopoverContainerContext);

  const container = containerRef.current ?? undefined;

  useControlLock(!!open);

  const handleOpenChange = useCallback(
    (changedToOpen: boolean) => {
      setHasOpenInnerPopup(changedToOpen);
      onOpenChange(changedToOpen);
    },
    [onOpenChange, setHasOpenInnerPopup],
  );

  useEffect(() => {
    setHasOpenInnerPopup(!!open);
  }, [open, setHasOpenInnerPopup]);

  return (
    <RadixPopover.Root
      modal
      open={open}
      onOpenChange={handleOpenChange}
      defaultOpen={defaultOpen}
    >
      {Trigger}
      <RadixPopover.Portal container={container}>
        <Content collisionPadding={10} sticky='always' className={className}>
          {children}
          {!noArrow && <Arrow />}
        </Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const DefaultTrigger = styled(RadixPopover.Trigger)`
  max-width: 100%;
`;

const Content = styled(RadixPopover.Content)`
  --popover-close-offset: ${p => p.theme.margin}rem;
  --popover-close-size: 25px;
  --popover-close-safe-area: calc(
    var(--popover-close-size) + (var(--popover-close-offset) * 2) -
      ${p => p.theme.margin}rem
  );
  background-color: ${p => transparentize(0.2, p.theme.colors.bgBody)};
  backdrop-filter: blur(10px);
  box-shadow: ${p => p.theme.boxShadowSoft};
  border-radius: ${p => p.theme.radius};
  position: relative;
  z-index: 10000000;
  animation: ${fadeIn} 0.1s ease-in-out;

  &[data-state='closed'] {
    animation: ${fadeIn} 0.1s ease-in-out reverse;
  }
`;

const Arrow = styled(RadixPopover.Arrow)`
  fill: ${p => p.theme.colors.bg2};
`;

const PopoverContainerContext = React.createContext<
  React.RefObject<HTMLDivElement>
>(React.createRef());

export const PopoverContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const popoverContainerRef = React.useRef<HTMLDivElement>(null);

  return (
    <ContainerDiv ref={popoverContainerRef}>
      <PopoverContainerContext.Provider value={popoverContainerRef}>
        {children}
      </PopoverContainerContext.Provider>
    </ContainerDiv>
  );
};

const ContainerDiv = styled.div`
  display: contents;
`;
