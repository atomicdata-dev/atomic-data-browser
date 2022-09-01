import React from 'react';

export interface DropdownTriggerProps {
  onClick: (event: React.MouseEvent) => void;
  isActive: boolean;
}

export type DropdownTriggerRenderFunction = React.ForwardRefRenderFunction<
  HTMLButtonElement,
  DropdownTriggerProps
>;
