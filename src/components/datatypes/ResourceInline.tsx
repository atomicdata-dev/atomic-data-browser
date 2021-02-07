import React, { ReactNode } from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import { truncateUrl } from '../../helpers/truncate';
import { urls } from '../../helpers/urls';
import { useString, useResource } from '../../lib/react';
import { ResourceStatus } from '../../lib/resource';

type Props = {
  children?: ReactNode;
  url: string;
};

/** Renders a markdown value */
function ResourceInline({ children, url }: Props): JSX.Element {
  const [, setSubject] = useQueryParam('subject', StringParam);
  const resource = useResource(url);

  const status = resource.getStatus();
  if (status == ResourceStatus.loading) {
    return null;
  }
  if (status == ResourceStatus.error) {
    return <div>{resource.getError().message}</div>;
  }

  const shortname = useString(resource, urls.properties.shortname);
  const description = useString(resource, urls.properties.description);

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

export default ResourceInline;
