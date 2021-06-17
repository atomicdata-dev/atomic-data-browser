import * as React from 'react';
import { Resource } from '@tomic/lib';
import { ContainerNarrow } from '../components/Containers';
import { ErrorLook } from '../components/ResourceInline';

type DrivePageProps = {
  resource: Resource;
  children: React.ReactNode;
};

function ErrorPage({ resource, children }: DrivePageProps): JSX.Element {
  return (
    <ContainerNarrow resource={resource.getSubject()}>
      <ErrorLook>{children}</ErrorLook>
    </ContainerNarrow>
  );
}

export default ErrorPage;
