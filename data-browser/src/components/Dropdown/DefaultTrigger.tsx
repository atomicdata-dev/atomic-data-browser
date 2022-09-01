import React from 'react';
import { Button } from '../Button';
import { DropdownTriggerRenderFunction } from './DropdownTrigger';

export const buildDefaultTrigger = (
  icon: React.ReactNode,
  ButtonComp: typeof Button = Button,
): DropdownTriggerRenderFunction => {
  const Comp = ({ onClick }, ref: React.Ref<HTMLButtonElement>) => (
    <ButtonComp icon subtle onClick={onClick} ref={ref}>
      {icon}
    </ButtonComp>
  );

  Comp.DisplayName = 'DefaultTrigger';

  return Comp;
};
