import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 2.5rem;
  padding: 0.4rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  -webkit-appearance: none;
  background-color: ${props => props.theme.colors.main};
  color: ${props => props.theme.colors.bg};

  &:hover {
    background-color: ${props => props.theme.colors.mainLight};
    color: ${props => props.theme.colors.bg};
  }

  &:active {
    background-color: ${props => props.theme.colors.mainDark};
  }

  &:disabled {
    display: none;
  }
`;

export const ButtonMargin = styled(Button)`
  margin-bottom: ${props => props.theme.margin}rem;
  border-radius: 999px;
  padding-left: ${props => props.theme.margin}rem;
  padding-right: ${props => props.theme.margin}rem;
  box-shadow: ${props => props.theme.boxShadow};

  &:active {
    box-shadow: ${props => props.theme.boxShadowIntense};
  }

  &:active {
    box-shadow: inset ${props => props.theme.boxShadowIntense};
  }
`;
