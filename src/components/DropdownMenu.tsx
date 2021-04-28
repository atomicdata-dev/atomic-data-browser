import React, { useRef, useState } from 'react';
import { FaBars, FaPlus } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useDetectOutsideClick } from '../helpers/useDetectOutsideClick';
import { Button, ButtonBar } from './Button';

/** Menu that opens on click and shows a bunch of items. Closes on Escape and on clicking outside */
export function DropdownMenu() {
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const history = useHistory();
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function handleClick() {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = dropdownRef.current.getBoundingClientRect();
    setX(triggerRect.x - menuRect.width + triggerRect.width);
    setY(triggerRect.y - menuRect.height);
    setIsActive(!isActive);
  }

  function handleNavigation(to: string) {
    history.push(to);
  }

  return (
    <MenuContainer>
      <ButtonBar rightPadding selected={isActive} ref={triggerRef} type='button' onClick={handleClick}>
        <FaBars />
      </ButtonBar>
      <Menu ref={dropdownRef} isActive={isActive} x={x} y={y}>
        <MenuItem
          clean
          onClick={() => {
            setIsActive(false);
            handleNavigation('/new');
          }}
        >
          New Resource
        </MenuItem>
        <MenuItem
          clean
          onClick={() => {
            setIsActive(false);
            handleNavigation('/shortcuts');
          }}
        >
          Shortcuts
        </MenuItem>
        <MenuItem
          clean
          onClick={() => {
            setIsActive(false);
            handleNavigation('/settings');
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          clean
          onClick={() => {
            setIsActive(false);
            window.open('https://github.com/joepio/atomic-data-browser');
          }}
        >
          Github (source code)
        </MenuItem>
        <MenuItem
          clean
          onClick={() => {
            setIsActive(false);
            window.open('https://discord.gg/a72Rv2P');
          }}
        >
          Discord (community)
        </MenuItem>
      </Menu>
    </MenuContainer>
  );
}

const MenuContainer = styled.div`
  position: relative;
`;

interface MenuProps {
  isActive: boolean;
  x: number;
  y: number;
}

const MenuItem = styled(Button)`
  display: block;
  height: 2rem;
  width: 100%;
  text-align: left;
  color: ${p => p.theme.colors.text};
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
  /* border-bottom-right-radius: 0; */
  position: fixed;
  z-index: 1;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  width: auto;
  box-shadow: ${p => p.theme.boxShadowIntense};
  opacity: ${p => (p.isActive ? 1 : 0)};
  visibility: ${p => (p.isActive ? 'visible' : 'hidden')};
`;
function handleNavigation(arg0: string): void {
  throw new Error('Function not implemented.');
}
