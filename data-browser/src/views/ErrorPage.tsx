import * as React from 'react';
import { Resource } from '@tomic/lib';
import { ContainerNarrow } from '../components/Containers';
import { ErrorLook } from '../components/ResourceInline';
import { Button } from '../components/Button';

type ErrorPageProps = {
  resource?: Resource;
  children?: React.ReactNode;
  error: Error;
  info: React.ErrorInfo;
  clearError: () => void;
};

function ErrorPage({
  resource,
  children,
  error,
  clearError,
}: ErrorPageProps): JSX.Element {
  return (
    <ContainerNarrow resource={resource?.getSubject()}>
      <ErrorLook>
        {children ? children : JSON.stringify(error?.message)}
      </ErrorLook>
      <div>
        <Button onClick={clearError}>Clear error</Button>
        <Button onClick={window.location.reload}>Reload page</Button>
      </div>
    </ContainerNarrow>
  );
}

export default ErrorPage;
