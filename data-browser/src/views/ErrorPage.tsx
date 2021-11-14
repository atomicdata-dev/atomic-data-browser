import * as React from 'react';
import { useCurrentAgent, useStore } from '@tomic/react';
import { Resource } from '@tomic/lib';
import { ContainerNarrow } from '../components/Containers';
import { ErrorLook } from './ResourceInline';
import { Button } from '../components/Button';
import { isUnauthorized } from '@tomic/lib/src/error';

type ErrorPageProps = {
  resource: Resource;
};

/**
 * A View for Resource Errors. Not to be confused with the CrashPage, which is
 * for App wide errors.
 */
function ErrorPage({ resource }: ErrorPageProps): JSX.Element {
  const [agent] = useCurrentAgent();
  const store = useStore();
  const subject = resource.getSubject();

  if (isUnauthorized(resource.error)) {
    return (
      <ContainerNarrow>
        <h1>Unauthorized</h1>
        {agent ? null : <p>Try signing in</p>}
        <p>{resource.error.message}</p>
        <Button onClick={() => store.fetchResource(subject)}>Retry</Button>
      </ContainerNarrow>
    );
  }
  return (
    <ContainerNarrow>
      <h1>⚠️ Error opening {resource.getSubject()}</h1>
      <ErrorLook>{resource.getError().message}</ErrorLook>
      <br />
      <Button onClick={() => store.fetchResource(subject)}>Retry</Button>
      <Button
        onClick={() => store.fetchResource(subject, { fromProxy: true })}
        title={`Fetches the URL from your current Atomic-Server (${store.getBaseUrl()}), instead of from the actual URL itself. Can be useful if the URL is down, but the resource is cached in your server.`}
      >
        Use proxy
      </Button>
    </ContainerNarrow>
  );
}

export default ErrorPage;
