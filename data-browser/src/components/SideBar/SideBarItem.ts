import styled from 'styled-components';

export interface SideBarItemProps {
  disabled?: boolean;
}

/** SideBarItem should probably be wrapped in an AtomicLink for optimal behavior */
// eslint-disable-next-line prettier/prettier
export const SideBarItem = styled('span')<SideBarItemProps>`
  padding-left: ${props => props.theme.margin}rem;
  padding-right: ${props => props.theme.margin}rem;
  display: flex;
  min-height: ${props => props.theme.margin * 0.5 + 1}rem;
  align-items: center;
  justify-content: flex-start;
  color: ${p => p.theme.colors.textLight};
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;

  &:disabled {
    background-color: ${p => p.theme.colors.bg1};
  }

  &:hover,
  &:focus {
    background-color: ${p => p.theme.colors.bg1};
    color: ${p => p.theme.colors.text};
  }
`;