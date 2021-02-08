import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { StringParam, useQueryParam } from 'use-query-params';
import { useStore } from '../lib/react';

type Props = {
  children?: ReactNode;
  url: string;
};

/** Renders a markdown value */
function Link({ children, url }: Props): JSX.Element {
  const [currentUrl, setSubject] = useQueryParam('subject', StringParam);
  const store = useStore();
  store.fetchResource(url);

  const handleClick = e => {
    e.preventDefault();
    if (currentUrl == url) {
      return;
    }
    setSubject(url);
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

const LinkView = styled.a<Proppies>`
  /* color: ${props => props.theme.colors.main}; */
  color: ${props => (props.disabled ? props.theme.colors.text : props.theme.colors.main)};
  text-decoration: none;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  &:hover {
    color: ${props => props.theme.colors.mainLight};
  }
  &:active {
    color: ${props => props.theme.colors.mainDark};
  }
`;

export default Link;
