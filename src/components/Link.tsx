import React, { ReactNode } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import { useStore } from '../lib/react';

type Props = {
  children?: ReactNode;
  url: string;
};

/** Renders a markdown value */
function Link({ children, url }: Props): JSX.Element {
  const [, setSubject] = useQueryParam('subject', StringParam);
  const store = useStore();
  store.fetchResource(url);

  const handleClick = e => {
    e.preventDefault();
    setSubject(url);
  };

  return (
    <a onClick={handleClick} href={url}>
      {children}
    </a>
  );
}

export default Link;
