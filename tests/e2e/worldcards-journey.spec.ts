import { expect, test } from '@playwright/test';

test('primary routes are available for the complete journey', async ({ page }) => {
  for (const route of ['/register', '/sign-in', '/collection', '/booster']) {
    const response = await page.goto(route);
    expect(response?.status()).toBeLessThan(500);
  }
});
