import { Resource } from '@tomic/react';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { constructOpenURL } from '../../../../helpers/navigation';

export interface SimpleResourceLinkProps {
  resource: Resource;
  className?: string;
}

export function SimpleResourceLink({
  resource,
  children,
  className,
}: React.PropsWithChildren<SimpleResourceLinkProps>): JSX.Element {
  const navigate = useNavigate();

  const url = useMemo(() => {
    try {
      return constructOpenURL(resource.getSubject());
    } catch (e) {
      return '#';
    }
  }, [resource]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // @ts-ignore
    navigate(url);
  };

  try {
    return (
      <a href={url} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  } catch (e) {
    return <>{resource.getSubject()}</>;
  }
}
