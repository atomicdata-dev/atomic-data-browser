import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
    hasError: false,
  };

  public static getDerivedStateFromError(e: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: e };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <h1>Error! {this.state.error}</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
