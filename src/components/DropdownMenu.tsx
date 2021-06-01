import React, { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaBars } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useDetectOutsideClick } from '../helpers/useDetectOutsideClick';
import { Button, ButtonBar } from './Button';

/**
 * Menu that opens on click and shows a bunch of items. Closes on Escape and on clicking outside. Use arrow keys to select items, and open
 * items on Enter. Renders the Dropdown on a place where there is room on screen.
 */
export function DropdownMenu(): JSX.Element {
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const history = useHistory();
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuItemLength = 6;
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
      defaultMenuItems[selectedIndex].onClick();
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
      const newSelected = selectedIndex > 0 ? selectedIndex - 1 : menuItemLength - 1;
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
      const newSelected = selectedIndex == menuItemLength - 1 ? 0 : selectedIndex + 1;
      setSelectedIndex(newSelected);
    },
    { enabled: isActive },
    [selectedIndex],
  );

  const defaultMenuItems = [
    {
      label: 'New Resource',
      onClick: () => {
        handleNavigation('/new');
      },
    },
    {
      label: 'Shortcuts',
      onClick: () => {
        handleNavigation('/shortcuts');
      },
    },
    {
      label: 'Settings',
      onClick: () => {
        handleNavigation('/settings');
      },
    },
    {
      label: 'Github',
      onClick: () => window.open('https://github.com/joepio/atomic-data-browser'),
    },
    {
      label: 'Discord',
      onClick: () => window.open('https://discord.gg/a72Rv2P'),
    },
    {
      label: 'Docs',
      onClick: () => window.open('https://docs.atomicdata.dev'),
    },
  ];

  function handleToggle() {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = dropdownRef.current.getBoundingClientRect();
    setX(triggerRect.x - menuRect.width + triggerRect.width);
    const topPos = triggerRect.y - menuRect.height;
    // If the top is outside of the screen, render it below
    if (topPos < 0) {
      setY(triggerRect.y + triggerRect.height);
    } else {
      setY(topPos);
    }
    isActive ? handleClose() : setIsActive(true);
  }

  function handleNavigation(to: string) {
    history.push(to);
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
        rightPadding
        selected={isActive}
        ref={triggerRef}
        type='button'
        onClick={() => {
          setUseKeys(false);
          handleToggle();
        }}
      >
        <FaBars />
      </ButtonBar>
      <Menu ref={dropdownRef} isActive={isActive} x={x} y={y}>
        {defaultMenuItems.map(({ label, onClick }, i) => (
          <MenuItem
            onClick={() => {
              handleClose();
              onClick();
            }}
            key={label}
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

interface MenuItemProps {
  onClick: () => any;
  label?: string;
  selected: boolean;
}

function MenuItem({ onClick, label, selected }: MenuItemProps) {
  return (
    <MenuItemStyled clean onClick={onClick} selected={selected}>
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
  color: ${p => (p.selected ? p.theme.colors.main : p.theme.colors.text)};
  padding: 0.8rem;
  height: auto;

  &:hover {
    background-color: ${p => p.theme.colors.bg1};
  }
  &:active {
    background-color: ${p => p.theme.colors.bg2};
  }
`;

const Menu = styled.nav<MenuProps>`
  overflow: hidden;
  background: ${p => p.theme.colors.bg};
  border: solid 1px ${props => props.theme.colors.bg2};
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
