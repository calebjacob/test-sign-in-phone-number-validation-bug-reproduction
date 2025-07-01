import { test, expect } from '@playwright/test';
import { clerk, clerkSetup } from '@clerk/testing/playwright';

test.describe.configure({ mode: 'serial' });

test('signs the user in with a valid test phone number with a 555 area code (+15555550100)', async ({
  page,
}) => {
  await clerkSetup();

  await page.goto('/sign-in');

  await clerk.signIn({
    page,
    signInParams: {
      // identifier: '+13035550100',
      identifier: '+15555550100',
      strategy: 'phone_code',
    },
  });

  await expect(page.getByLabel('Open user button')).toBeVisible();
});

test('signs the user in with a valid test phone number with an area code other than 555 (+13035550100)', async ({
  page,
}) => {
  await clerkSetup();

  await page.goto('/sign-in');

  await clerk.signIn({
    page,
    signInParams: {
      identifier: '+13035550100',
      strategy: 'phone_code',
    },
  });

  await expect(page.getByLabel('Open user button')).toBeVisible();
});
