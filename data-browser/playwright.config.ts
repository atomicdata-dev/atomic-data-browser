import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: { screenshot: 'only-on-failure' },
  workers: 1,
};
export default config;
