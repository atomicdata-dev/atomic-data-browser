import * as React from 'react';
import { Resource } from '@tomic/react';

import { ContainerNarrow } from '../components/Containers';
import { ErrorLook } from './ResourceInline';
import { Button } from '../components/Button';

type ErrorPageProps = {
  resource?: Resource;
  children?: React.ReactNode;
  error: Error;
  info: React.ErrorInfo;
  clearError: () => void;
};

/** If the entire app crashes, show this page */
function CrashPage({
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
        <Button
          onClick={() =>
            window.setTimeout(window.location.reload.bind(window.location), 200)
          }
        >
          Reload page
        </Button>
      </div>
    </ContainerNarrow>
  );
}

export default CrashPage;
