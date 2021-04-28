import * as React from 'react';
import styled from 'styled-components';
import { useSettings } from '../helpers/AppSettings';

interface NavBarButtonProps {
  top: boolean;
  floating: boolean;
  title: string;
}

/** Button used for indicating where the navbar will be placed */
export function NavStyleButton({ top, floating, title }: NavBarButtonProps): JSX.Element {
  const { navbarTop, setNavbarTop, navbarFloating, setNavbarFloating } = useSettings();

  console.log(navbarFloating, navbarTop);

  return (
    <NavStyleButtonStyling
      title={title}
      current={navbarTop == top && navbarFloating == floating}
      onClick={() => {
        setNavbarTop(top);
        setNavbarFloating(floating);
      }}
    >
      <svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
        {floating ? <rect x='10' y='60' width='60' height='10' rx='5' /> : <rect x='0' y={top ? '0' : '70'} width='80' height='10' />}
      </svg>
    </NavStyleButtonStyling>
  );
}

interface NavStyleButtonStylingProps {
  current: boolean;
}

const NavStyleButtonStyling = styled.button<NavStyleButtonStylingProps>`
  rect {
    fill: ${p => (p.current ? p.theme.colors.main : p.theme.colors.bg2)};
  }
  &:hover {
    border-color: ${p => p.theme.colors.mainLight};
  }
  &:active {
    border-color: ${p => p.theme.colors.mainDark};
  }
  cursor: pointer;
  border: solid 1px ${p => (p.current ? p.theme.colors.mainLight : p.theme.colors.bg2)};
  margin-right: 1rem;
  margin-bottom: 1rem;
  border-radius: ${props => props.theme.radius};
  padding: 0;
  overflow: hidden;
  background: none;
  line-height: 0;
`;
