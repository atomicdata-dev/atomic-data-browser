import React from 'react';
import { Button } from '../Button';
import { DropdownTriggerRenderFunction } from './DropdownTrigger';

export const buildDefaultTrigger = (
  icon: React.ReactNode,
  ButtonComp: typeof Button = Button,
  title = 'Open menu',
): DropdownTriggerRenderFunction => {
  const Comp = ({ onClick, menuId }, ref: React.Ref<HTMLButtonElement>) => (
    <ButtonComp
      aria-controls={menuId}
      icon
      subtle
      onClick={onClick}
      ref={ref}
      title={title}
    >
      {icon}
    </ButtonComp>
  );

  Comp.DisplayName = 'DefaultTrigger';

  return Comp;
};
