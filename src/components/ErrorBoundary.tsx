import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error?: Error;
}

/** Prints an error if there is one in the children */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
  };

  public static getDerivedStateFromError(e: Error): State {
    // Update state so the next render will show the fallback UI.
    return { error: e };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.error) {
      return <p>Error: {this.state.error.message}</p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
