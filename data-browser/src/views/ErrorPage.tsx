import * as React from 'react';
import { isUnauthorized, useStore } from '@tomic/react';
import { ContainerNarrow } from '../components/Containers';
import { ErrorLook } from './ResourceInline';
import { Button } from '../components/Button';
import { SignInButton } from '../components/SignInButton';
import { useSettings } from '../helpers/AppSettings';
import { ResourcePageProps } from './ResourcePage';
import { Row } from '../components/Row';
import CrashPage from './CrashPage';

/**
 * A View for Resource Errors. Not to be confused with the CrashPage, which is
 * for App wide errors.
 */
function ErrorPage({ resource }: ResourcePageProps): JSX.Element {
  const { agent } = useSettings();
  const store = useStore();
  const subject = resource.getSubject();

  if (isUnauthorized(resource.error)) {
    return (
      <ContainerNarrow>
        <h1>Unauthorized</h1>
        {agent ? (
          <>
            <p>{resource.error?.message}</p>
            <Button onClick={() => store.fetchResource(subject)}>Retry</Button>
          </>
        ) : (
          <>
            <p>{"You don't have access to this, try signing in:"}</p>
            <SignInButton />
          </>
        )}
      </ContainerNarrow>
    );
  }

  return (
    <ContainerNarrow>
      <h1>⚠️ Error opening {resource.getSubject()}</h1>
      <ErrorLook>{resource.error?.message}</ErrorLook>
      <Row>
        <Button
          onClick={() => store.fetchResource(subject, { setLoading: true })}
        >
          Retry
        </Button>
        <Button
          onClick={() =>
            store.fetchResource(subject, { fromProxy: true, setLoading: true })
          }
          title={`Fetches the URL from your current Atomic-Server (${store.getServerUrl()}), instead of from the actual URL itself. Can be useful if the URL is down, but the resource is cached in your server.`}
        >
          Use proxy
        </Button>
      </Row>
    </ContainerNarrow>
  );
}

export default ErrorPage;

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallBackComponent: React.ComponentType;
}

interface ErrorBoundaryState {
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined };
  }

  public static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  public render() {
    if (this.state.error) {
      return (
        <CrashPage
          error={this.state.error}
          clearError={() => this.setState({ error: undefined })}
          info={{} as React.ErrorInfo}
        />
      );
    }

    return this.props.children;
  }
}
