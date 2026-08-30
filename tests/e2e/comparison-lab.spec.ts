import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("comparison journey preserves context and exposes evidence", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const failedResponses: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/compare");

  await expect(
    page.getByRole("heading", { level: 1, name: "See the energy trade-offs" }),
  ).toBeVisible();
  await expect(page.getByLabel("Nuclear: 12 g CO₂e / kWh")).toBeVisible();

  await page.getByRole("button", { name: "Remove Coal" }).click();
  await page.getByRole("button", { name: "Range" }).click();
  await page.getByRole("button", { name: "Technical" }).click();

  await expect(page.getByRole("button", { name: "Range" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Technical" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.locator("[data-chart-label]", { hasText: "Coal" }),
  ).toHaveCount(0);
  await expect(page.getByText("Range evidence pending review")).toHaveCount(4);

  await page.getByRole("button", { name: "Typical" }).click();
  await page.getByRole("button", { name: "Table view" }).click();
  await expect(
    page.getByRole("table", {
      name: "Lifecycle greenhouse-gas emissions comparison",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Chart view" }).click();

  const evidenceTrigger = page.getByRole("button", {
    name: "Explore the evidence",
  });
  await evidenceTrigger.focus();
  await evidenceTrigger.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Why this number?" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(evidenceTrigger).toBeFocused();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(failedResponses).toEqual([]);
  expect(consoleErrors).toEqual([]);
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
});

test("mobile comparison reflows without core horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/compare");

  await expect(
    page.getByRole("heading", { level: 1, name: "See the energy trade-offs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explore the evidence" }),
  ).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
