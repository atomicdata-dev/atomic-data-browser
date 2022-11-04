import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import { FaEdit, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

export interface PopoverProps {
  label: string;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Popover({
  children,
  open,
  onOpenChange,
  label,
}: React.PropsWithChildren<PopoverProps>): JSX.Element {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <Trigger>
        <FaEdit /> {label}
      </Trigger>
      <RadixPopover.Portal>
        <Content sideOffset={5}>
          {children}
          <Close>
            <FaTimes />
          </Close>
          <Arrow />
        </Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

const Trigger = styled(RadixPopover.Trigger)`
  max-width: 100%;
`;

const Content = styled(RadixPopover.Content)`
  --popover-close-offset: ${p => p.theme.margin}rem;
  --popover-close-size: 25px;
  --popover-close-safe-area: calc(
    var(--popover-close-size) + (var(--popover-close-offset) * 2) -
      ${p => p.theme.margin}rem
  );
  background-color: ${p => p.theme.colors.bgBody};
  border: 1px solid ${p => p.theme.colors.bg2};
  padding: ${p => p.theme.margin}rem;
  box-shadow: ${p => p.theme.boxShadowSoft};
  border-radius: ${p => p.theme.radius};
  position: relative;
`;

const Arrow = styled(RadixPopover.Arrow)`
  fill: ${p => p.theme.colors.bg2};
`;

const Close = styled(RadixPopover.Close)`
  border: none;
  background-color: ${p => p.theme.colors.main};
  color: white;
  appearance: none;
  font-family: inherit;
  border-radius: 100%;
  height: var(--popover-close-size);
  width: var(--popover-close-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: var(--popover-close-offset);
  right: var(--popover-close-offset);
`;
