import { expect, test } from "@playwright/test";
test("unreleased India profile stays out of public navigation and search", async ({
  page,
}) => {
  expect((await page.goto("/india"))?.status()).toBe(404);
  await page.goto("/");
  await expect(page.locator('a[href="/india"]')).toHaveCount(0);
  await page.goto("/search?q=india");
  await expect(page.locator('a[href="/india"]')).toHaveCount(0);
});
