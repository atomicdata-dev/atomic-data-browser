import { desaturate } from 'polished';
import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  -webkit-appearance: none;
  background-color: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.bg};
  outline: none;
  transition: 0.1s transform, 0.1s background-color, 0.1s box-shadow;

  &:hover:not([disabled]),
  &:focus:not([disabled]) {
    background-color: ${props => props.theme.colors.mainLight};
    color: ${props => props.theme.colors.bg};
    transform: scale(1.05);
  }

  &:active:not([disabled]) {
    background-color: ${props => props.theme.colors.mainDark};
    transition: 0s transform, 0s background-color;
    transform: scale(1);
  }

  &:disabled {
    cursor: default;
    display: auto;
    background-color: ${props => desaturate(0.5, props.theme.colors.mainDark)};
    color: ${props => props.theme.colors.bg2};
  }
`;

export const ButtonBar = styled(Button)`
  min-width: 2.5rem;
  padding: 0.4rem;
`;

export const ButtonMargin = styled(Button)`
  padding: 0.4rem;
  margin-bottom: ${props => props.theme.margin}rem;
  border-radius: 999px;
  padding-left: ${props => props.theme.margin}rem;
  padding-right: ${props => props.theme.margin}rem;
  box-shadow: ${props => props.theme.boxShadow};
  display: inline-block;
  margin-right: ${props => props.theme.margin}rem;

  &:hover {
    box-shadow: ${props => props.theme.boxShadowIntense};
  }

  &:active {
    box-shadow: inset ${props => props.theme.boxShadowIntense};
  }
`;

export const ButtonIcon = styled(Button)`
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 999px;
  font-size: 0.8em;
  width: 1.3rem;
  height: 1.3rem;
  display: inline-flex;

  &:active {
    box-shadow: ${props => props.theme.boxShadowIntense};
  }

  &:active {
    box-shadow: inset ${props => props.theme.boxShadowIntense};
  }
`;

/** A button inside an input field */
export const ButtonInput = styled(Button)`
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
