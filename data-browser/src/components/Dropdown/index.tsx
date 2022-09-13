import React, { useId, useMemo, useRef, useState } from 'react';
import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import { useClickAwayListener } from '../../hooks/useClickAwayListener';
import { Button } from '../Button';
import { DropdownTriggerRenderFunction } from './DropdownTrigger';
import { shortcuts } from '../HotKeyWrapper';
import { Shortcut } from '../Shortcut';

interface DropdownMenuProps {
  /** The list of menu items */
  items: MenuItemMinimial[];
  trigger: DropdownTriggerRenderFunction;
}

/**
 * Menu that opens on click and shows a bunch of items. Closes on Escape and on
 * clicking outside. Use arrow keys to select items, and open items on Enter.
 * Renders the Dropdown on a place where there is room on screen.
 */
export function DropdownMenu({
  items,
  trigger,
}: DropdownMenuProps): JSX.Element {
  const menuId = useId();
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const handleClose = useCallback(() => {
    setIsActive(false);
    // Whenever the menu closes, assume that the next one will be opened with mouse
    setUseKeys(false);
    // Always reset to the top item on close
    setSelectedIndex(0);
  }, []);

  useClickAwayListener([triggerRef, dropdownRef], handleClose, isActive, [
    'click',
    'mouseout',
  ]);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuItemLength = items.length;
  // if the keyboard is used to navigate the menu items
  const [useKeys, setUseKeys] = useState(false);

  const handleToggle = useCallback(() => {
    if (isActive) {
      handleClose();

      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = dropdownRef.current.getBoundingClientRect();
    const topPos = triggerRect.y - menuRect.height;

    // If the top is outside of the screen, render it below
    if (topPos < 0) {
      setY(triggerRect.y + triggerRect.height / 2);
    } else {
      setY(topPos + triggerRect.height / 2);
    }

    const leftPos = triggerRect.x - menuRect.width;

    // If the left is outside of the screen, render it to the right
    if (leftPos < 0) {
      setX(triggerRect.x);
    } else {
      setX(triggerRect.x - menuRect.width + triggerRect.width);
    }

    setIsActive(true);
  }, [isActive]);

  const handleTriggerClick = useCallback(() => {
    setUseKeys(false);
    handleToggle();
  }, [handleToggle]);

  // Close the menu
  useHotkeys(
    'esc',
    () => {
      handleClose();
    },
    { enabled: isActive },
  );
  // Toggle menu
  useHotkeys(
    shortcuts.menu,
    e => {
      e.preventDefault();
      handleToggle();
      setUseKeys(true);
    },
    {},
    [isActive],
  );
  // Click / open the item
  useHotkeys(
    'enter',
    e => {
      e.preventDefault();
      items[selectedIndex].onClick();
      handleClose();
    },
    { enabled: isActive },
    [selectedIndex],
  );
  // Move up (or to bottom if at top)
  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      setUseKeys(true);
      const newSelected =
        selectedIndex > 0 ? selectedIndex - 1 : menuItemLength - 1;
      setSelectedIndex(newSelected);
    },
    { enabled: isActive },
    [selectedIndex],
  );
  // Move down (or to top if at bottom)
  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      setUseKeys(true);
      const newSelected =
        selectedIndex === menuItemLength - 1 ? 0 : selectedIndex + 1;
      setSelectedIndex(newSelected);

      return false;
    },
    { enabled: isActive },
    [selectedIndex],
  );

  const Trigger = useMemo(() => React.forwardRef(trigger), []);

  return (
    <>
      <Trigger
        ref={triggerRef}
        onClick={handleTriggerClick}
        isActive={isActive}
        menuId={menuId}
      />
      <Menu ref={dropdownRef} isActive={isActive} x={x} y={y} id={menuId}>
        {items.map(
          ({ label, onClick, helper, id, disabled, shortcut, icon }, i) => (
            <MenuItem
              onClick={() => {
                handleClose();
                onClick();
              }}
              data-test={`menu-item-${id}`}
              disabled={disabled}
              key={id}
              helper={shortcut ? `${helper} (${shortcut})` : helper}
              label={label}
              selected={useKeys && selectedIndex === i}
              icon={icon}
              shortcut={shortcut}
            />
          ),
        )}
      </Menu>
    </>
  );
}

interface MenuProps {
  isActive: boolean;
  x: number;
  y: number;
}

export interface MenuItemMinimial {
  onClick: () => unknown;
  label: string;
  helper?: string;
  id?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Keyboard shortcut helper */
  shortcut?: string;
}

export interface MenuItemSidebarProps extends MenuItemMinimial {
  handleClickItem?: () => unknown;
}

interface MenuItemPropsExtended extends MenuItemSidebarProps {
  selected: boolean;
}

export function MenuItem({
  onClick,
  selected,
  helper,
  disabled,
  shortcut,
  icon,
  label,
  ...props
}: MenuItemPropsExtended): JSX.Element {
  return (
    <MenuItemStyled
      clean
      onClick={onClick}
      selected={selected}
      title={helper}
      disabled={disabled}
      {...props}
    >
      {icon}
      <StyledLabel>{label}</StyledLabel>
      {shortcut && <StyledShortcut shortcut={shortcut} />}
    </MenuItemStyled>
  );
}

const StyledShortcut = styled(Shortcut)`
  margin-left: 0.3rem;
`;

const StyledLabel = styled.span`
  flex: 1;
`;

interface MenuItemStyledProps {
  selected: boolean;
}

// eslint-disable-next-line prettier/prettier
const MenuItemStyled = styled(Button)<MenuItemStyledProps>`
  align-items: center;
  display: flex;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  color: ${p => p.theme.colors.text};
  padding: 0.4rem 1rem;
  height: auto;
  text-transform: capitalize;
  background-color: ${p =>
    p.selected ? p.theme.colors.bg1 : p.theme.colors.bg};
  text-decoration: ${p => (p.selected ? 'underline' : 'none')};

  &:hover {
    background-color: ${p => p.theme.colors.bg1};
  }
  &:active {
    background-color: ${p => p.theme.colors.bg2};
  }
  &:disabled {
    color: ${p => p.theme.colors.textLight};
    &:hover {
      cursor: 'default';
    }
    background-color: ${p => p.theme.colors.bg};
  }

  svg {
    color: ${p => p.theme.colors.textLight};
  }
`;

const Menu = styled.div<MenuProps>`
  overflow: hidden;
  background: ${p => p.theme.colors.bg};
  border: ${p =>
    p.theme.darkMode ? `solid 1px ${p.theme.colors.bg2}` : 'none'};
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border-radius: 8px;
  position: fixed;
  z-index: 1;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  width: auto;
  box-shadow: ${p => p.theme.boxShadowSoft};
  opacity: ${p => (p.isActive ? 1 : 0)};
  visibility: ${p => (p.isActive ? 'visible' : 'hidden')};
`;
