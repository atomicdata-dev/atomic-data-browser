import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: { screenshot: 'only-on-failure' },
  workers: 10,
};
export default config;
