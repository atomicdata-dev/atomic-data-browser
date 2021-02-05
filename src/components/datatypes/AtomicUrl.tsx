import React, { ReactNode } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import { urls } from '../../helpers/urls';
import { usePropString, useResource } from '../../lib/react';

type Props = {
  children?: ReactNode;
  url: string;
};

/** Renders a markdown value */
function AtomicUrl({ children, url }: Props): JSX.Element {
  const [, setSubject] = useQueryParam('subject', StringParam);
  const resource = useResource(url);
  const shortname = usePropString(resource, urls.props.shortname);

  const handleClick = e => {
    e.preventDefault();
    setSubject(url);
  };

  return (
    <a onClick={handleClick} href={url}>
      {children ? children : shortname ? shortname : url}
    </a>
  );
}

export default AtomicUrl;
