import { TestConfig } from './e2e.spec';
const demoFileName = 'logo.svg';

export const testConfig: TestConfig = {
  demoFileName,
  demoFile: `./${demoFileName}`,
  demoInviteName: 'document demo',
  serverUrl: 'http://localhost:9883',
  frontEndUrl: 'http://localhost:5173',
  initialTest: false,
};
