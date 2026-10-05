import { expect, test } from '@playwright/test';

test('primary pages have headings', async ({ page }) => {
  for (const route of ['/register', '/sign-in', '/collection', '/booster']) {
    await page.goto(route);
    await expect(page.getByRole('heading').first()).toBeVisible();
  }
});
