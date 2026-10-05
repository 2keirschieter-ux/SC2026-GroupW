import { expect, test } from '@playwright/test';

test('card detail route returns a response', async ({ page }) => {
  const response = await page.goto('/cards/not-a-real-card');
  expect(response?.status()).toBeLessThan(500);
});
