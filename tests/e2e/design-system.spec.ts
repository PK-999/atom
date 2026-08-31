import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("design system playground exposes the complete keyboard-accessible primitive set", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/design-system?level=expert", {
    waitUntil: "domcontentloaded",
  });

  await expect(
    page.getByRole("heading", { level: 1, name: "ATOM component playground" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Expert" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const summaryTab = page.getByRole("tab", { name: "Summary" });
  await summaryTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Method" })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.getByRole("button", { name: "Open command menu" }).click();
  const command = page.getByRole("dialog", { name: "Browse fixture metrics" });
  await command.getByRole("searchbox").fill("reliability");
  await command.getByRole("button", { name: /Reliability fixture/ }).click();
  await expect(
    page.getByText("Reliability fixture", { exact: true }),
  ).toBeVisible();

  const passportTrigger = page.getByRole("button", {
    name: "Why this number?",
  });
  await passportTrigger.focus();
  await passportTrigger.click();
  await expect(
    page.getByRole("dialog", { name: "Why this number?" }),
  ).toBeVisible();
  const openDialogAccessibility = await new AxeBuilder({ page }).analyze();
  expect(openDialogAccessibility.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(passportTrigger).toBeFocused();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("design system mobile composition avoids core horizontal scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/design-system", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { level: 1, name: "ATOM component playground" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open drawer" }).click();
  const drawer = page.getByRole("dialog", { name: "Drawer example" });
  const box = await drawer.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(390);
  expect(
    box ? Math.abs(box.y + box.height - 844) : Number.POSITIVE_INFINITY,
  ).toBeLessThanOrEqual(2);
  await page.keyboard.press("Escape");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("design system remains usable with reduced motion and 200% zoom equivalent", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto("/design-system", { waitUntil: "domcontentloaded" });

  const transitionSeconds = await page
    .getByRole("button", { name: "Primary action" })
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).transitionDuration),
    );
  expect(transitionSeconds).toBeLessThanOrEqual(0.001);

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
