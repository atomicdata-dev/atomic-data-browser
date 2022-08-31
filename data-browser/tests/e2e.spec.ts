// This file is copied from `atomic-data-browser` to `atomic-data-server` when `yarn build-server` is run.
// This is why the `testConfig` is imported.

import { test, expect, Page } from '@playwright/test';
import { testConfig } from './test-config';

export interface TestConfig {
  demoFileName: string;
  demoFile: string;
  demoInviteName: string;
  serverUrl: string;
  frontEndUrl: string;
  /** If /setup is used to register */
  initialTest: boolean;
}

const {
  demoFileName,
  demoFile,
  demoInviteName,
  serverUrl,
  frontEndUrl,
  initialTest,
} = testConfig;

const timestamp = new Date().toLocaleTimeString();
const editableTitle = '[data-test="editable-title"]';
const sidebarDriveEdit = '[data-test="sidebar-drive-edit"]';
const sideBarNewResource = '[data-test="sidebar-new-resource"]';
const currentDriveTitle = '[data-test=current-drive-title]';
const navbarCurrentUser = '[data-test="navbar-current-user"]';
const publicReadRight =
  '[data-test="right-public"] input[type="checkbox"] >> nth=0';

test.describe('data-browser', async () => {
  test.beforeEach(async ({ page }) => {
    // Open the server
    await page.goto(frontEndUrl);
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.click(sidebarDriveEdit);
    await openLocalhost(page);
  });

  test('sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 500, height: 800 });
    await page.reload();
    // TODO: this keeps hanging. How do I make sure something is _not_ visible?
    // await expect(page.locator('text=new resource')).not.toBeVisible();
    await page.click('[data-test="sidebar-toggle"]');
    await expect(await page.locator('text=new resource')).toBeVisible();
  });

  test('switch Server URL', async ({ page }) => {
    await expect(page.locator(`text=${demoInviteName}`)).not.toBeVisible();
    await page.fill('[data-test="server-url-input"]', 'https://atomicdata.dev');
    await page.click('[data-test="server-url-save"]');
    await expect(page.locator(`text=${demoInviteName}`)).toBeVisible();
  });

  test('sign in with secret, edit profile, sign out', async ({ page }) => {
    await signIn(page);
    await expect(page.locator(navbarCurrentUser)).toBeVisible();
    await editProfileAndCommit(page);

    // Sign out
    await page.click('text=user settings');
    page.on('dialog', d => {
      d.accept();
    });
    await page.click('[data-test="sign-out"]');
    await expect(page.locator(navbarCurrentUser)).not.toBeVisible();
    await expect(page.locator('text=Enter your Agent secret')).toBeVisible();
  });

  test('sign up and edit document atomicdata.dev', async ({ page }) => {
    await openAtomic(page);
    // Use invite
    await page.click(`text=${demoInviteName}`);
    await page.click('text=Accept as new user');
    await expect(page.locator(editableTitle)).toBeVisible();
    await expect(page.locator(navbarCurrentUser)).toBeVisible();
    // Check if we can edit our profile
    await editProfileAndCommit(page);
    // We need the initial enter because removing the top line isn't working ATM
    await page.keyboard.press('Enter');
    const teststring = `Testline ${timestamp}`;
    await page.fill('[data-test="element-input"]', teststring);
    // This next line can be flaky, maybe the text disappears because it's overwritten?
    await expect(page.locator(`text=${teststring}`)).toBeVisible();
    // Remove the text again for cleanup
    await page.keyboard.press('Alt+Backspace');
    await expect(page.locator(`text=${teststring}`)).not.toBeVisible();
    const docTitle = `Document Title ${timestamp}`;
    await page.click(editableTitle, { delay: 200 });
    await page.fill(editableTitle, docTitle);
    // Not sure if this test is needed - it fails now.
    // await expect(page.locator(documentTitle)).toBeFocused();
  });

  test('search', async ({ page }) => {
    await page.fill('[data-test="address-bar"]', 'setup');
    await page.click('text=setup');
    await expect(page.locator('text=Use this Invite')).toBeVisible();
  });

  test('collections & data view', async ({ page }) => {
    await openAtomic(page);
    // collections, pagination, sorting
    await page.fill(
      '[data-test="address-bar"]',
      'https://atomicdata.dev/properties',
    );
    await page.click(
      '[data-test="sort-https://atomicdata.dev/properties/description"]',
    );
    // These values can change as new Properties are added to atomicdata.dev
    const firstPageText = 'text=append';
    const secondPageText = 'text=download-url';
    await expect(page.locator(firstPageText)).toBeVisible();
    await page.click('[data-test="next-page"]');
    await expect(page.locator(firstPageText)).not.toBeVisible();
    await expect(page.locator(secondPageText)).toBeVisible();

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
    await expect(page.locator('text=Copied')).toBeVisible();
  });

  test('localhost setup, create document, edit, page title, websockets', async ({
    page,
    browser,
  }) => {
    // Setup initial user (this test can only be run once per server)
    await page.click('[data-test="sidebar-drive-open"]');
    await expect(page.locator('text=/setup')).toBeVisible();
    // Don't click on setup - this will take you to a different domain, not to the dev build!
    // await page.click('text=/setup');
    await page.fill('[data-test="address-bar"]', `${serverUrl}/setup`);
    await signIn(page);
    if (initialTest) {
      await expect(page.locator('text=Accept as')).toBeVisible();
      // await page.click('[data-test="accept-existing"]');
      await page.click('text=Accept as Test');
    }
    // Create a document
    await page.click('a:has-text("collections")');
    await page.click('a:has-text("documents")');
    await page.click('[title="Create a new document"]');
    // commit for saving initial document
    await page.waitForResponse(`${serverUrl}/commit`);
    // commit for initializing the first element (paragraph)
    await page.waitForResponse(`${serverUrl}/commit`);
    await page.click(editableTitle);
    const title = `Nice title ${timestamp}`;
    // These keys make sure the onChange handler is properly called
    await page.keyboard.press('Space');
    await page.keyboard.press('Backspace');
    await page.waitForTimeout(100);
    // await page.fill(documentTitle, title);
    await page.keyboard.type(title);

    // commit for editing title
    await page.waitForResponse(`${serverUrl}/commit`);
    // await page.click('[data-test="document-edit"]');
    // await expect(await page.title()).toEqual(title);
    await page.press(editableTitle, 'Enter');
    await page.waitForTimeout(500);
    const teststring = `My test: ${timestamp}`;
    await page.fill('textarea', teststring);
    // commit editing paragraph
    await expect(await page.locator(`text=${teststring}`)).toBeVisible();

    // multi-user
    const currentUrl = page.url();
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto(currentUrl);
    await page2.setViewportSize({ width: 1000, height: 400 });
    await openLocalhost(page2);
    await page2.goto(currentUrl);
    await expect(page2.locator(`text=${teststring}`)).toBeVisible();
    await expect(await page2.title()).toEqual(title);

    // Add a new line on first page, check if it appears on the second
    await page.keyboard.press('Enter');
    await page.waitForResponse(`${serverUrl}/commit`);
    await page.waitForResponse(`${serverUrl}/commit`);
    const syncText = 'New paragraph';
    await page.keyboard.type(syncText);
    // If this fails to show up, websockets aren't working properly
    await expect(page2.locator(`text=${syncText}`)).toBeVisible();
  });

  /**
   * We remove public read rights from drive, create an invite, open that
   * invite, and add the public read right again.
   */
  test('authorization, invite, share menu', async ({
    page,
    browser,
    context,
  }) => {
    // Remove public read rights for Drive
    await signIn(page);
    const { driveURL, driveTitle } = await newDrive(page);
    await page.click(currentDriveTitle);
    await page.click('[data-test="context-menu"]');
    await page.click('button:has-text("share")');
    const hasPublicRead = await page.isChecked(publicReadRight);
    if (hasPublicRead) {
      // For some reason this doesn't work without waiting
      await page.waitForTimeout(400);
      // Cleanup, set to public read again
      await page.click(publicReadRight);
      await page.click('button:has-text("Save")');
    }

    // Initialize unauthorized page for reader
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.setViewportSize({ width: 1000, height: 400 });
    await page2.goto(driveURL);
    await openLocalhost(page2);
    await page2.click(currentDriveTitle);
    await expect(await page2.locator('text=Unauthorized')).toBeVisible();

    // Create invite
    await page.click('button:has-text("Send invite")');
    context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.click('button:has-text("Create Invite")');
    await expect(
      await page.locator('text=Invite created and copied '),
    ).toBeVisible();
    const inviteUrl = await page.evaluate(() =>
      document
        ?.querySelector('[data-code-content]')
        ?.getAttribute('data-code-content'),
    );

    expect(inviteUrl).not.toBeNull();
    // Open invite
    await openSubject(page2, inviteUrl!);
    await page2.click('button:has-text("Accept")');
    await expect(page2.locator(`text=${driveTitle}`)).toBeVisible();

    // Cleanup, set to public read again
    // timeout Prevents weird race condition (see above)
    await page.waitForTimeout(400);
    expect(await page.isChecked(publicReadRight)).toBeFalsy();
    await page.click(publicReadRight);
    expect(await page.isChecked(publicReadRight)).toBeTruthy();
    await page.click('button:has-text("Save")');
    await expect(await page.locator('text=Share settings saved')).toBeVisible();
  });

  test('upload, download', async ({ page }) => {
    await signIn(page);
    await page.goto(
      `${frontEndUrl}/app/edit?subject=http%3A%2F%2Flocalhost%3A9883%2Ffiles`,
    );
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('button:has-text("Upload file")'),
    ]);
    await fileChooser.setFiles(demoFile);
    await page.click(`[data-test]:has-text("${demoFileName}")`);
    await expect(
      await page.locator('[data-test="image-viewer"]'),
    ).toBeVisible();
  });

  test('bookmark', async ({ page }) => {
    await signIn(page);
    await openLocalhost(page);
    await newDrive(page);

    // Create a new bookmark
    await page.locator(sideBarNewResource).click();
    await page.locator('button:has-text("bookmark")').click();

    // Fetch `example.com
    const input = page.locator('[placeholder="https\\:\\/\\/example\\.com"]');
    await input.click();
    await input.fill('https://example.com');
    await page.locator('footer >> text=Ok').click();

    await expect(page.locator('text=This domain is ')).toBeVisible();
  });

  test('dialog', async ({ page }) => {
    await signIn(page);
    await newDrive(page);
    // Create new class from new resource menu
    await page.locator(sideBarNewResource).click();
    await expect(page).toHaveURL(`${frontEndUrl}/app/new`);
    await page.locator('button:has-text("class")').click();
    await page
      .locator('[title="Add an item to this list"] >> nth=0')
      .first()
      .click();
    await page.locator('[data-test="input-recommends"]').click();
    await page.locator('[data-test="input-recommends"]').fill('test-prop');

    // Create new Property using dialog
    await page.locator('text=Create property: test-prop').click();
    await expect(page.locator('h1:has-text("new property")')).toBeVisible();
    await page.locator('[data-test="input-datatype"]').click();
    await page
      .locator(
        'li:has-text("boolean - Either `true` or `false`. In JSON-AD, th...")',
      )
      .click();
    await page.locator('dialog textarea[name="yamdeContent"]').click();
    await page
      .locator('dialog textarea[name="yamdeContent"]')
      .fill('This is a test prop');
    await page.locator('dialog footer >> text=Save').click();

    expect(
      await page.locator(
        '[data-test="input-recommends"] >> nth=0 >> "test-prop"',
      ),
    );
  });
});

/** Signs in using an AtomicData.dev test user */
async function signIn(page: Page) {
  await page.click('text=user settings');
  await expect(
    await page.locator('text=edit data and sign Commits'),
  ).toBeVisible();
  // If there are any issues with this agent, try creating a new one https://atomicdata.dev/invites/1
  const test_agent =
    'eyJzdWJqZWN0IjoiaHR0cHM6Ly9hdG9taWNkYXRhLmRldi9hZ2VudHMvaElNWHFoR3VLSDRkM0QrV1BjYzAwUHVFbldFMEtlY21GWStWbWNVR2tEWT0iLCJwcml2YXRlS2V5IjoiZkx0SDAvY29VY1BleFluNC95NGxFemFKbUJmZTYxQ3lEekUwODJyMmdRQT0ifQ==';
  await page.click('#current-password');
  await page.fill('#current-password', test_agent);
  await expect(await page.locator('text=Edit profile')).toBeVisible();
  await page.goBack();
}

/** Set localhost as current server */
async function openLocalhost(page: Page) {
  await page.click(sidebarDriveEdit);
  await page.click('[data-test="server-url-localhost"]');
  // This fails when the user is not authorized
  // await expect(page.locator(currentDriveTitle)).toHaveText('localhost');
}

/**
 * Create a new drive, go to it, and set it as the current drive. Returns URL of
 * drive and its name
 */
async function newDrive(page: Page) {
  // Create new drive to prevent polluting the main drive
  await page.locator('text=new resource').click();
  await expect(page).toHaveURL(`${frontEndUrl}/app/new`);
  await page.locator('button:has-text("drive")').click();
  await page.waitForNavigation();
  const driveURL = await page
    .locator('[data-test="address-bar"]')
    .getAttribute('value');
  await expect(driveURL).toContain('localhost');
  const driveTitle = `testdrive-${timestamp}`;
  await page.click('[data-test="editable-title"]');
  await page.fill('[data-test="editable-title"]', driveTitle);
  return { driveURL: driveURL as string, driveTitle };
}

/** Set localhost as current server */
async function openSubject(page: Page, subject: string) {
  await page.fill('[data-test="address-bar"]', subject);
}

/** Set atomicdata.dev as current server */
async function openAtomic(page: Page) {
  await page.click(sidebarDriveEdit);
  // Set AtomicData.dev as the server
  await page.click('[data-test="server-url-atomic"]');
  // Accept the invite, create an account if necessary
  await expect(await page.locator(currentDriveTitle)).toHaveText('Atomic Data');
}

async function editProfileAndCommit(page: Page) {
  await page.click('text=user settings');
  // Edit profile and save commit
  await page.click('text=Edit profile');
  await expect(await page.locator('text=add another property')).toBeVisible();
  const username = `Test user edited at ${new Date().toLocaleDateString()}`;
  await page.fill('[data-test="input-name"]', username);
  await page.click('[data-test="save"]');
  await expect(await page.locator('text=saved')).toBeVisible();
  await page.waitForURL(/\/app\/show/);
  await expect(await page.locator(`text=${username}`)).toBeVisible();
}