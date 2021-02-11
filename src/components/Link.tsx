import React, { ReactNode } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { createSubjectUrl } from '../helpers/navigation';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { useStore } from '../atomic-react/hooks';

type Props = {
  children?: ReactNode;
  url: string;
};

/** Renders an openable Resource. Only for Atomic Resources. */
function Link({ children, url }: Props): JSX.Element {
  const [currentUrl] = useCurrentSubject();
  const history = useHistory();
  const store = useStore();
  store.fetchResource(url);

  const handleClick = e => {
    e.preventDefault();
    if (currentUrl == url) {
      return;
    }
    history.push(createSubjectUrl(url));
  };

  return (
    <LinkView onClick={handleClick} href={url} disabled={currentUrl == url} tabIndex={currentUrl == url ? -1 : 0}>
      {children}
    </LinkView>
  );
}

type Proppies = {
  disabled?: boolean;
};

export const LinkView = styled.a<Proppies>`
  /* color: ${props => props.theme.colors.main}; */
  color: ${props => (props.disabled ? props.theme.colors.text : props.theme.colors.main)};
  text-decoration: none;
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};

  &:hover {
    color: ${props => props.theme.colors.mainLight};
  }
  &:active {
    color: ${props => props.theme.colors.mainDark};
  }
`;

export default Link;
