import { expect, test } from '@playwright/test';

test('registration and sign-in pages are reachable', async ({ page }) => {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
  await page.goto('/sign-in');
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
});
