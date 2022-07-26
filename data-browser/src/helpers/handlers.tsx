import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact, {
  BugsnagErrorBoundary,
} from '@bugsnag/plugin-react';
import React from 'react';
import { isDev } from '../config';

export function handleError(e: Error): void {
  console.error(e);
  if (!isDev) {
    Bugsnag.notify(e);
  }
}

export function handleWarning(e: Error | string): void {
  // eslint-disable-next-line no-console
  console.warn(e);
  // TODO maybe handle these in Bugsnag?
}

export function handleInfo(e: Error): void {
  // eslint-disable-next-line no-console
  console.info(e);
  if (!isDev) {
    Bugsnag.notify(e);
  }
}

export function initBugsnag(apiKey?: string): BugsnagErrorBoundary {
  Bugsnag.start({
    apiKey,
    plugins: [new BugsnagPluginReact()],
    releaseStage: isDev() ? 'development' : 'production',
    enabledReleaseStages: ['production'],
    autoDetectErrors: !isDev(),
  });
  return Bugsnag.getPlugin('react').createErrorBoundary(React);
}
