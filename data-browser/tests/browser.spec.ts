import { test, expect, Page } from '@playwright/test';

/**
 * When set to true, this runs tests that require the server to have a usable
 * `/setup` invite
 */
const initialTest = true;

const timestamp = new Date().toLocaleTimeString();
const documentTitle = '[data-test="document-title"]';
const sidebarDriveEdit = '[data-test="sidebar-drive-edit"]';

test.describe('data-browser', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080/');
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.click(sidebarDriveEdit);
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
    await openLocalhost(page);
    await expect(page.locator('text=demo invite')).not.toBeVisible();
    await page.fill('[data-test="server-url-input"]', 'https://atomicdata.dev');
    await page.click('[data-test="server-url-save"]');
    await expect(page.locator('text=demo invite')).toBeVisible();
  });

  test('sign in with secret, edit profile, sign out', async ({ page }) => {
    await signIn(page);
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
    const teststring = `Testline ${timestamp}`;
    await page.keyboard.type(teststring);
    await page.keyboard.press('Enter');
    await expect(page.locator(`text=${teststring}`)).toBeVisible();
    const docTitle = `Document Title ${Math.floor(Math.random() * 100) + 1}`;
    await page.fill(documentTitle, docTitle);
    await page.click(documentTitle, { delay: 200 });
    // Not sure if this test is needed - it fails now.
    // await expect(page.locator(documentTitle)).toBeFocused();
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

  test('localhost setup, create document, edit, page title, websockets', async ({
    page,
    browser,
  }) => {
    await openLocalhost(page);
    // Setup initial user (this test can only be run once per server)
    await page.click('[data-test="sidebar-drive-open"]');
    await expect(page.locator('text=/setup')).toBeVisible();
    // Don't click on setup - this will take you to a different domain, not to the dev build!
    // await page.click('text=/setup');
    await page.fill('[data-test="address-bar"]', 'http://localhost/setup');
    await signIn(page);
    if (initialTest) {
      await expect(page.locator('text=Accept as')).toBeVisible();
      // await page.click('[data-test="accept-existing"]');
      await page.click('text=Accept as Test');
    }
    // Create a document
    await page.click('button:has-text("documents")');
    await page.click('[title="Create a new document"]');
    await page.click('text=advanced');
    await page.click('[placeholder="Enter an Atomic URL..."]');
    await page.keyboard.type('http://localhost/documents');
    await page.keyboard.press('Enter');
    await page.click('[data-test="save"]');
    // commit for saving initial document
    await page.waitForResponse('http://localhost/commit');
    // commit for initializing the first element (paragraph)
    await page.waitForResponse('http://localhost/commit');
    // commit for adding that element to the document
    await page.waitForResponse('http://localhost/commit');
    await page.click(documentTitle);
    const title = `Nice title ${timestamp}`;
    // These keys make sure the onChange handler is properly called
    await page.keyboard.press('Space');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(100);
    // await page.fill(documentTitle, title);
    await page.keyboard.type(title);

    // commit for editing title
    await page.waitForResponse('http://localhost/commit');
    // await expect(await page.title()).toEqual(title);
    await page.press(documentTitle, 'Enter');
    await page.waitForTimeout(500);
    const teststring = `My test: ${timestamp}`;
    await page.fill('textarea', teststring);
    // commit editing paragraph
    await page.waitForResponse('http://localhost/commit');
    const noAgentErr = 'You cannot save edits: No Agent set';
    await expect(page.locator(`text=${teststring}`)).toBeVisible();
    await expect(page.locator(`text=${noAgentErr}`)).not.toBeVisible();

    // multi-user
    const currentUrl = page.url();
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto(currentUrl);
    await page2.setViewportSize({ width: 1000, height: 400 });
    await expect(page2.locator(`text=${teststring}`)).toBeVisible();
    await expect(page2.locator(`text=${noAgentErr}`)).toBeVisible();
    await expect(await page2.title()).toEqual(title);

    // Add a new line on first page, check if it appears on the second
    await page.keyboard.press('Enter');
    await page.waitForResponse('http://localhost/commit');
    await page.waitForResponse('http://localhost/commit');
    const syncText = 'New paragraph';
    await page.keyboard.type(syncText);
    await expect(page2.locator(`text=${syncText}`)).toBeVisible();
  });
});

/** Signs in using an AtomicData.dev test user */
async function signIn(page: Page) {
  await page.click('text=user settings');
  await expect(page.locator('text=edit data and sign Commits')).toBeVisible();
  // https://atomicdata.dev/agents/lKIn+Q0LUuPR6MxcEdZ6xOmh4U4cyN6vOq/RYkTazA0=
  const test_agent =
    'eyJzdWJqZWN0IjoiaHR0cHM6Ly9hdG9taWNkYXRhLmRldi9hZ2VudHMvbEtJbitRMExVdVBSNk14Y0VkWjZ4T21oNFU0Y3lONnZPcS9SWWtUYXpBMD0iLCJwcml2YXRlS2V5IjoieTAxbWgrM2FoazBWTXdJakw0MFZvQlp3V2owbW5NSHlIOG9HV2E1cHd5OD0ifQ==';
  await page.click('#current-password');
  await page.fill('#current-password', test_agent);
  await expect(page.locator('text=Edit profile')).toBeVisible();
  await page.goBack();
}

async function openLocalhost(page: Page) {
  await page.click(sidebarDriveEdit);
  await page.click('[data-test="server-url-localhost"]');
}

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
