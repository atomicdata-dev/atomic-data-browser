import React, { ReactNode } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { openURL } from '../helpers/navigation';
import { useCurrentSubject } from '../helpers/useCurrentSubject';
import { useStore } from '../atomic-react/hooks';

type Props = {
  children?: ReactNode;
  url: string;
};

/** Renders an openable Resource. Only for Atomic Resources. */
function AtomicLink({ children, url: urlString }: Props): JSX.Element {
  const [currentUrl] = useCurrentSubject();
  const history = useHistory();
  const store = useStore();
  store.fetchResource(urlString);

  const url = new URL(urlString);

  const handleClick = e => {
    e.preventDefault();
    if (currentUrl == urlString) {
      return;
    }
    if (window.location.origin == url.origin) {
      const path = url.pathname + url.search;
      history.push(path);
    } else {
      history.push(openURL(urlString));
    }
  };

  return (
    <LinkView
      about={urlString}
      onClick={handleClick}
      href={urlString}
      disabled={currentUrl == urlString}
      tabIndex={currentUrl == urlString ? -1 : 0}
    >
      {children}
    </LinkView>
  );
}

type Proppies = {
  disabled?: boolean;
};

/** Look clickable, should be used for opening things only - not interactions. */
export const LinkView = styled.a<Proppies>`
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

export default AtomicLink;
