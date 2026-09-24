import { expect, test } from "@playwright/test";
test("internal component fixtures are not a public product route", async ({
  page,
}) => {
  const response = await page.goto("/design-system");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("ATOM component playground")).toHaveCount(0);
});
// The public drawer, tabs, theme controls and evidence overlays are exercised in
// experience.spec.ts and comparison-lab.spec.ts, using real user journeys.
