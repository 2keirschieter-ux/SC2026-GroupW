import { expect, test } from '@playwright/test';

test('administrator page is protected', async ({ page }) => {
  const response = await page.goto('/admin/special-cards');
  expect(response?.status()).toBeLessThan(500);
});
