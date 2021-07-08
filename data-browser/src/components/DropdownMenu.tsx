import React, { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaEllipsisV } from 'react-icons/fa';
import styled from 'styled-components';
import { useDetectOutsideClick } from '../helpers/useDetectOutsideClick';
import { Button, ButtonBar } from './Button';

interface DropdownMenuProps {
  /** The list of menu items */
  items: MenuItemProps[];
  /**
   * The Component that should be clicked to open the menu. Must accept an
   * onClick handler .
   */
  // children: React.ReactNode;
}

/**
 * Menu that opens on click and shows a bunch of items. Closes on Escape and on
 * clicking outside. Use arrow keys to select items, and open items on Enter.
 * Renders the Dropdown on a place where there is room on screen.
 */
export function DropdownMenu({ items }: DropdownMenuProps): JSX.Element {
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuItemLength = items.length;
  // if the keyboard is used to navigate the menu items
  const [useKeys, setUseKeys] = useState(false);
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
    'm',
    () => {
      handleToggle(), setUseKeys(true);
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
        selectedIndex == menuItemLength - 1 ? 0 : selectedIndex + 1;
      setSelectedIndex(newSelected);
      return false;
    },
    { enabled: isActive },
    [selectedIndex],
  );

  function handleToggle() {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = dropdownRef.current.getBoundingClientRect();
    const topPos = triggerRect.y - menuRect.height;
    // If the top is outside of the screen, render it below
    if (topPos < 0) {
      setY(triggerRect.y + triggerRect.height);
    } else {
      setY(topPos);
    }
    const leftPos = triggerRect.x - menuRect.width;
    // If the left is outside of the screen, render it to the right
    if (leftPos < 0) {
      setX(triggerRect.x);
    } else {
      setX(triggerRect.x - menuRect.width + triggerRect.width);
    }
    isActive ? handleClose() : setIsActive(true);
  }

  function handleClose() {
    setIsActive(false);
    // Whenever the menu closes, assume that the next one will be opened with mouse
    setUseKeys(false);
    // Always reset to the top item on close
    setSelectedIndex(0);
  }

  return (
    <>
      <ButtonBar
        selected={isActive}
        ref={triggerRef}
        title='Open menu (m)'
        type='button'
        onClick={() => {
          setUseKeys(false);
          handleToggle();
        }}
      >
        <FaEllipsisV />
      </ButtonBar>
      <Menu ref={dropdownRef} isActive={isActive} x={x} y={y}>
        {items.map(({ label, onClick, helper, id, disabled }, i) => (
          <MenuItem
            onClick={() => {
              handleClose();
              onClick();
            }}
            disabled={disabled}
            key={id}
            helper={helper}
            label={label}
            selected={useKeys && selectedIndex == i}
          />
        ))}
      </Menu>
    </>
  );
}

interface MenuProps {
  isActive: boolean;
  x: number;
  y: number;
}

export interface MenuItemProps {
  onClick: () => unknown;
  label: string;
  helper?: string;
  id?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface MenuItemPropsExtended extends MenuItemProps {
  selected: boolean;
}

export function MenuItem({
  onClick,
  label,
  selected,
  helper,
  disabled,
}: MenuItemPropsExtended): JSX.Element {
  return (
    <MenuItemStyled
      clean
      onClick={onClick}
      selected={selected}
      title={helper}
      disabled={disabled}
    >
      {label}
    </MenuItemStyled>
  );
}

interface MenuItemStyledProps {
  selected: boolean;
}

// eslint-disable-next-line prettier/prettier
const MenuItemStyled = styled(Button) <MenuItemStyledProps>`
  display: block;
  height: 2rem;
  width: 100%;
  text-align: left;
  color: ${p => p.theme.colors.text};
  padding: 0.4rem 0.7rem;
  height: auto;
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
`;

const Menu = styled.nav<MenuProps>`
  overflow: hidden;
  background: ${p => p.theme.colors.bg};
  border: solid 1px ${props => props.theme.colors.bg2};
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border-radius: 8px;
  position: fixed;
  z-index: 1;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  width: auto;
  box-shadow: ${p => p.theme.boxShadowIntense};
  opacity: ${p => (p.isActive ? 1 : 0)};
  visibility: ${p => (p.isActive ? 'visible' : 'hidden')};
`;
