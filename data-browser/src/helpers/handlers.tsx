import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact, { BugsnagErrorBoundary } from '@bugsnag/plugin-react';
import React from 'react';
import { isDev } from '../config';

export function handleError(e: Error): void {
  console.error(e);
  if (!isDev) {
    Bugsnag.notify(e);
  }
}

export function handleWarning(e: Error | string): void {
  console.warn(e);
  // TODO maybe handle these in Bugsnag?
}

export function handleInfo(e: Error): void {
  console.info(e);
  if (!isDev) {
    Bugsnag.notify(e);
  }
}

export function initBugsnag(): BugsnagErrorBoundary {
  Bugsnag.start({
    apiKey: '0b41fa51d1367cdfc1165ccf7436467f',
    plugins: [new BugsnagPluginReact()],
    releaseStage: isDev() ? 'development' : 'production',
    autoDetectErrors: !isDev(),
  });
  return Bugsnag.getPlugin('react').createErrorBoundary(React);
}
