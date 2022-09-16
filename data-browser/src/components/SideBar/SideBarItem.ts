import styled from 'styled-components';

export interface SideBarItemProps {
  disabled?: boolean;
}

/** SideBarItem should probably be wrapped in an AtomicLink for optimal behavior */
// eslint-disable-next-line prettier/prettier
export const SideBarItem = styled('span')<SideBarItemProps>`
  display: flex;
  min-height: ${props => props.theme.margin * 0.5 + 1}rem;
  align-items: center;
  justify-content: flex-start;
  color: ${p => p.theme.colors.textLight};
  padding: 0.2rem;
  padding-left: 1rem;
  text-overflow: ellipsis;
  text-decoration: none;
  border-radius: ${p => p.theme.radius};

  &:disabled {
    background-color: ${p => p.theme.colors.bg1};
  }

  &:hover,
  &:focus {
    background-color: ${p => p.theme.colors.bg1};
    color: ${p => p.theme.colors.text};
  }
  &:active {
    background-color: ${p => p.theme.colors.bg2};
  }
`;
