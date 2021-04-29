import { desaturate } from 'polished';
import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** Renders the button less clicky */
  subtle?: boolean;
  /** If it's just an icon */
  icon?: boolean;
  /** If it needs margins */
  margins?: boolean;
  /** Minimal styling */
  clean?: boolean;
}

export function Button({ children, clean, icon, ...props }: ButtonProps): JSX.Element {
  let Comp = ButtonMargin;
  if (icon) {
    Comp = ButtonIcon;
  }
  if (clean) {
    Comp = ButtonClean;
  }

  return (
    <Comp type='button' {...props}>
      {children}
    </Comp>
  );
}

// /** Style-only props */
// interface ButtonProps {
//   // Less visually agressive button. Show only borders in color, instead of entire button
//   subtle?: boolean;
// }

/** Extremly minimal set of button properties */
export const ButtonClean = styled.button`
  cursor: pointer;
  border: none;
  outline: none;
  font-size: 1rem;
  margin: 0;
  -webkit-appearance: none;
  background-color: initial;
  -webkit-tap-highlight-color: transparent; /** Remove the tap / click effect on touch devices */
`;

/** Base button style. You're likely to want to use ButtonMargin in most places */
export const ButtonBase = styled(ButtonClean)`
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.bg};
  /* transition: 0.1s transform, 0.1s background-color, 0.1s box-shadow, 0.1s color; */

  /** Prevent sticky hover buttons on touch devices */
  @media (hover: hover) and (pointer: fine) {
    &:hover:not([disabled]),
    &:focus-visible:not([disabled]) {
      background-color: ${props => props.theme.colors.mainLight};
      color: ${props => props.theme.colors.bg};
      transform: scale(1.05);
      outline: 0;
    }
  }

  &:active:not([disabled]) {
    transition: all 0s;
    background-color: ${props => props.theme.colors.mainDark};
    /* transition: 0s transform, 0s background-color; */
    transform: scale(1);
  }

  &:disabled {
    cursor: default;
    display: auto;
    background-color: ${props => desaturate(0.5, props.theme.colors.mainDark)};
    color: ${props => props.theme.colors.bg2};
  }
`;

interface ButtonBarProps {
  leftPadding?: boolean;
  rightPadding?: boolean;
  selected?: boolean;
}

/** Button inside the navigation bar */
// eslint-disable-next-line prettier/prettier
export const ButtonBar = styled(ButtonBase) <ButtonBarProps>`
  padding: 0.7rem;
  border: none;
  color: ${p => (p.selected ? p.theme.colors.bg : p.theme.colors.main)};
  background-color: ${p => (p.selected ? p.theme.colors.main : p.theme.colors.bg)};
  height: auto;

  &:hover:not([disabled]),
  /* &:active:not([disabled]), */
  &:focus-visible:not([disabled]) {
    transform: scale(1);
  }

  padding-left: ${p => (p.leftPadding ? '1.2rem' : '')};
  padding-right: ${p => (p.rightPadding ? '1.2rem' : '')};
`;

/** Button with some basic margins around it */
// eslint-disable-next-line prettier/prettier
export const ButtonMargin = styled(ButtonBase) <ButtonProps>`
  padding: 0.4rem;
  margin-bottom: ${props => props.theme.margin}rem;
  border-radius: ${props => props.theme.radius};
  padding-left: ${props => props.theme.margin}rem;
  padding-right: ${props => props.theme.margin}rem;
  box-shadow: ${props => props.theme.boxShadow};
  display: inline-flex;
  margin-right: ${props => props.theme.margin}rem;
  background-color: ${props => (props.subtle ? props.theme.colors.bg : props.theme.colors.main)};
  border: solid 1px ${props => props.theme.colors.main};
  color: ${props => (props.subtle ? props.theme.colors.main : props.theme.colors.bg)};
  border: solid 1px ${props => props.theme.colors.main};

  &:hover:not([disabled]) {
    box-shadow: ${props => props.theme.boxShadowIntense};
  }

  &:active:not([disabled]) {
    box-shadow: inset ${props => props.theme.boxShadowIntense};
  }
`;

/** Button that only shows an icon */
export const ButtonIcon = styled(ButtonMargin)`
  box-shadow: ${props => props.theme.boxShadow};
  border: none;
  border-radius: 999px;
  font-size: 0.8em;
  width: 1.3rem;
  height: 1.3rem;
  display: inline-flex;
  margin: 0;
  padding: 0;

  &:active:not([disabled]) {
    box-shadow: ${props => props.theme.boxShadowIntense};
  }

  &:active:not([disabled]) {
    box-shadow: inset ${props => props.theme.boxShadowIntense};
  }
`;

/** A button inside an input field */
export const ButtonInput = styled(ButtonBase)`
  background-color: ${props => props.theme.colors.bg1};
  color: ${props => props.theme.colors.text};
  flex: 0;
  height: auto;
  border-left: solid 1px ${props => props.theme.colors.bg2};
  border-radius: 0;

  &:last-child {
    border-radius: ${props => props.theme.radius};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;
