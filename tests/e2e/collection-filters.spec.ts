import { expect, test } from '@playwright/test';

test('collection page exposes filter controls', async ({ page }) => {
  await page.goto('/collection');
  await expect(page.getByRole('heading', { name: /your collection/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
});
