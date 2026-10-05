import { expect, test } from '@playwright/test';

test('booster page exposes a single opening action', async ({ page }) => {
  await page.goto('/booster');
  await expect(page.getByRole('button', { name: /open booster/i })).toBeVisible();
});
