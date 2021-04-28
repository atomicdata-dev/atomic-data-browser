import * as React from 'react';
import styled from 'styled-components';
import { useSettings } from '../helpers/AppSettings';

interface NavBarButtonProps {
  top?: boolean;
  floating?: boolean;
}

export function NavStyleButton({ top, floating }: NavBarButtonProps): JSX.Element {
  const { navbarTop, setNavbarTop, navbarFloating, setNavbarFloating } = useSettings();

  return (
    <NavStyleButtonStyling
      current={navbarTop == top && navbarFloating == floating}
      onClick={() => {
        setNavbarTop(top);
        setNavbarFloating(floating);
      }}
      width='80'
      height='80'
      viewBox='0 0 80 80'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {floating ? (
        <rect x='10' y='60' width='60' height='10' rx='5' fill='#A6A6A6' />
      ) : (
        <rect x='0' y={top ? '0' : '70'} width='80' height='10' fill='#A6A6A6' />
      )}
    </NavStyleButtonStyling>
  );
}

interface NavStyleButtonStylingProps {
  current: boolean;
}

const NavStyleButtonStyling = styled.svg<NavStyleButtonStylingProps>`
  cursor: pointer;
  rect {
    fill: ${p => p.theme.colors.main};
  }
  &:hover {
    border-color: ${p => p.theme.colors.mainLight};
  }
  &:active {
    border-color: ${p => p.theme.colors.mainDark};
  }
  border: solid 5px ${p => (p.current ? p.theme.colors.mainLight : p.theme.colors.bg2)};
  margin-right: 1rem;
  border-radius: 5px;
`;
