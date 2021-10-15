import {
  playwrightLauncher,
  playwrightLauncherPage,
} from '@web/test-runner-playwright';

export default {
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
};

describe('<App>', () => {
  it('renders resource after clicking on fetch', async () => {
    const page = playwrightLauncherPage.page();
    await page.goto('http://localhost:8080/');
    // await page.goto('http://localhost/');

    await page.setViewportSize({ width: 1000, height: 400 });

    // Check setup
    // await page.click('[data-test="sidebar-drive"]');
    // await expect(page.locator('text=setup')).toBeVisible();
    // await page.click('text=setup');
    // await expect(page.locator('text=no usages left')).toBeVisible();

    // Sign in using a secret
    await page.click('text=user settings');
    await expect(page.locator('text=edit data and sign Commits')).toBeVisible();
    const test_agent =
      'eyJzdWJqZWN0IjoiaHR0cHM6Ly9hdG9taWNkYXRhLmRldi9hZ2VudHMvbEtJbitRMExVdVBSNk14Y0VkWjZ4T21oNFU0Y3lONnZPcS9SWWtUYXpBMD0iLCJwcml2YXRlS2V5IjoieTAxbWgrM2FoazBWTXdJakw0MFZvQlp3V2owbW5NSHlIOG9HV2E1cHd5OD0ifQ==';
    await page.click('#current-password');
    await page.fill('#current-password', test_agent);

    // Edit profile and save commit
    await page.click('text=Edit profile');
    await expect(page.locator('text=add another property')).toBeVisible();
    await page.fill(
      '[data-test="https://atomicdata.dev/properties/name"]',
      `Test user edited at ${new Date().toLocaleDateString()}`,
    );
    await page.click('[data-test="save"]');
    await expect(page.locator('text=saved')).toBeVisible();

    // search
    await page.fill('[data-test="address-bar"]', 'name');
    await page.click('text=name');
    await expect(page.locator('text=name of a thing')).toBeVisible();

    // collections, pagination, sorting
    await page.fill(
      '[data-test="address-bar"]',
      'https://atomicdata.dev/properties',
    );
    await page.click(
      '[data-test="sort-https://atomicdata.dev/properties/description"]',
    );
    await expect(page.locator('text=A base64')).toBeVisible();
    await page.click('[data-test="next-page"]');
    await expect(page.locator('text=Where a redirect')).toBeVisible();
  });
});
