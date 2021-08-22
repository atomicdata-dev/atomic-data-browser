import { test, expect, Page } from '@playwright/test';

test.describe('data-browser', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/');
    // await page.goto('http://localhost/');

    await page.setViewportSize({ width: 1200, height: 800 });
    await page.click('[data-test="sidebar-drive-edit"]');
    await page.click('[data-test="server-url-atomic"]');
    await expect(page.locator('text=demo invite')).toBeVisible();
  });

  test('sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 800 });
    await page.reload();
    // TODO: this keeps hanging. How do I make sure something is _not_ visible?
    // await expect(page.locator('text=new resource')).not.toBeVisible();
    await page.click('[data-test="sidebar-toggle"]');
    await expect(page.locator('text=new resource')).toBeVisible();
  });

  test('switch Server URL', async ({ page }) => {
    await page.fill('[data-test="server-url-input"]', 'http://localhost');
    await page.click('[data-test="server-url-save"]');
    await expect(page.locator('text=demo invite')).not.toBeVisible();
    await page.fill('[data-test="server-url-input"]', 'https://atomicdata.dev');
    await page.click('[data-test="server-url-save"]');
    await expect(page.locator('text=demo invite')).toBeVisible();
  });

  test('sign in with secret, edit profile, sign out', async ({ page }) => {
    await page.click('text=user settings');
    await expect(page.locator('text=edit data and sign Commits')).toBeVisible();
    const test_agent =
      'eyJzdWJqZWN0IjoiaHR0cHM6Ly9hdG9taWNkYXRhLmRldi9hZ2VudHMvbEtJbitRMExVdVBSNk14Y0VkWjZ4T21oNFU0Y3lONnZPcS9SWWtUYXpBMD0iLCJwcml2YXRlS2V5IjoieTAxbWgrM2FoazBWTXdJakw0MFZvQlp3V2owbW5NSHlIOG9HV2E1cHd5OD0ifQ==';
    await page.click('#current-password');
    await page.fill('#current-password', test_agent);
    await expect(page.locator('text=Edit profile')).toBeVisible();

    await editProfileAndCommit(page);

    // Sign out
    await page.click('text=user settings');
    page.on('dialog', d => {
      d.accept();
    });
    await page.click('[data-test="sign-out"]');
    await expect(page.locator('text=Enter your Agent secret')).toBeVisible();
  });

  test('sign up with invite, edit, versions', async ({ page }) => {
    // Setup initial user (this test can only be run once per server)
    // await expect(page.locator('text=setup')).toBeVisible();
    // await page.click('text=setup');
    // await expect(page.locator('text=no usages left')).toBeVisible();

    // Use invite
    await page.click('text=demo invite');
    await page.click('text=Accept as new user');
    // The computer is so fast that the page does not work
    await expect(page.locator('text=User created!')).toBeVisible();
    // Click the toast notification
    await page.click('text=User Settings');

    await editProfileAndCommit(page);

    // Versions
    await page.click('[data-test="context-menu"]');
    await page.click('text=versions');
    await expect(page.locator('text=Versions of')).toBeVisible();
    // TODO: fix versioning!
    // await page.click('text=atomicdata.dev/versioning?');
  });

  test('sign up and edit document', async ({ page }) => {
    // Use invite
    await page.click('text=document invite');
    await page.click('text=Accept as new user');
    await expect(page.locator('text=User created!')).toBeVisible();
    const teststring = `Testline ${new Date().toLocaleTimeString()}`;
    await page.keyboard.type(teststring);
    await page.keyboard.press('Enter');
    // TODO: refresh the page to make sure the commit is saved
    // setTimeout(async () => await page.reload(), 1000);
    // await page.reload();`
    await expect(page.locator(`text=${teststring}`)).toBeVisible();
    const docTitle = `Document Title ${Math.floor(Math.random() * 100) + 1}`;
    await page.fill('[data-test="document-title"]', docTitle);
    await page.click('[data-test="document-title"]', { delay: 100 });
    await expect(page.locator('[data-test="document-title"]')).toBeFocused();
  });

  test('search', async ({ page }) => {
    await page.fill(
      '[data-test="address-bar"]',
      'https://atomicdata.dev/properties/name',
    );
    await expect(page.locator('text=name of a thing')).toBeVisible();
    await page.fill('[data-test="address-bar"]', 'name');
    await page.click('text=name');
    await expect(page.locator('text=name of a thing')).toBeVisible();
  });

  test('collections & data view', async ({ page }) => {
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

    // context menu, keyboard & data view
    await page.click('[data-test="context-menu"]');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Fetch as')).toBeVisible();
    await page.click('[data-test="fetch-json-ad"]');
    await expect(
      page.locator(
        'text="https://atomicdata.dev/properties/collection/members": [',
      ),
    ).toBeVisible();
    await page.click('[data-test="fetch-json"]');
    await expect(page.locator('text=  "members": [')).toBeVisible();
    await page.click('[data-test="fetch-json-ld"]');
    await expect(page.locator('text="current-page": {')).toBeVisible();
    await page.click('[data-test="fetch-turtle"]');
    await expect(page.locator('text=<http')).toBeVisible();
    await page.click('[data-test="copy-response"]');
    await expect(page.locator('text=Copied!')).toBeVisible();
  });
});

async function editProfileAndCommit(page: Page) {
  await page.click('text=user settings');
  // Edit profile and save commit
  await page.click('text=Edit profile');
  await expect(page.locator('text=add another property')).toBeVisible();
  await page.fill(
    '[data-test="https://atomicdata.dev/properties/name"]',
    `Test user edited at ${new Date().toLocaleDateString()}`,
  );
  await page.click('[data-test="save"]');
  await expect(page.locator('text=saved')).toBeVisible();
}
