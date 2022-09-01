import React from 'react';
import { ButtonBar } from '../Button';
import { FaEllipsisV } from 'react-icons/fa';
import { DropdownTriggerRenderFunction } from '../Dropdown/DropdownTrigger';
import { shortcuts } from '../HotKeyWrapper';

export const MenuBarDropdownTrigger: DropdownTriggerRenderFunction = (
  { onClick, isActive },
  ref,
) => (
  <ButtonBar
    selected={isActive}
    ref={ref}
    title={`Open menu (${shortcuts.menu})`}
    type='button'
    data-test='context-menu'
    onClick={onClick}
  >
    <FaEllipsisV />
  </ButtonBar>
);

MenuBarDropdownTrigger.displayName = 'MenuBarDropdownTrigger';
