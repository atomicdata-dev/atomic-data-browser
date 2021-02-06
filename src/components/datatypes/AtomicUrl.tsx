import React, { ReactNode } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import { truncateUrl } from '../../helpers/truncate';
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
  const shortname = usePropString(resource, urls.properties.shortname);
  const description = usePropString(resource, urls.properties.description);

  const handleClick = e => {
    e.preventDefault();
    setSubject(url);
  };

  return (
    <a onClick={handleClick} href={url} title={description ? description : null}>
      {children ? children : shortname ? shortname : truncateUrl(url, 40)}
    </a>
  );
}

export default AtomicUrl;
