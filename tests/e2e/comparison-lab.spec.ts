import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("comparison journey preserves context and exposes evidence", async ({
  page,
}, testInfo) => {
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

  await page.goto("/compare", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await expect(
    page.getByRole("heading", { level: 1, name: "See the energy trade-offs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Accessible comparison summary" }),
  ).toContainText("Nuclear: 12 g CO₂e / kWh");

  await page.getByRole("button", { name: "Remove Coal" }).click();
  await expect(
    page.locator("[data-chart-label]", { hasText: "Coal" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Range" }).click();
  await expect(page.getByRole("button", { name: "Range" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "Technical" }).click();

  await expect(page.getByRole("button", { name: "Range" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: "Technical" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page).toHaveURL(/(?:\?|&)level=technical(?:&|$)/);
  await expect(
    page.locator("[data-chart-label]", { hasText: "Coal" }),
  ).toHaveCount(0);
  await expect(
    page.locator("[data-chart-value]", {
      hasText: "Range evidence pending review",
    }),
  ).toHaveCount(4);
  await page.reload();
  await expect(page.getByRole("button", { name: "Technical" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

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
  if (testInfo.project.name === "chromium") {
    for (let press = 0; press < 40; press += 1) {
      if (
        await evidenceTrigger.evaluate(
          (element) => element === document.activeElement,
        )
      ) {
        break;
      }
      await page.keyboard.press("Tab");
    }
    await expect(evidenceTrigger).toBeFocused();
  } else {
    await evidenceTrigger.focus();
  }
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Why this number?" }),
  ).toBeVisible();
  const openDialogAccessibility = await new AxeBuilder({ page }).analyze();
  expect(openDialogAccessibility.violations).toEqual([]);
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
  await page.goto("/compare", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { level: 1, name: "See the energy trade-offs" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explore the evidence" }),
  ).toBeVisible();
  await expect(page.getByText("Complexity")).toBeVisible();
  await expect(page.getByText("Curious", { exact: true })).toBeVisible();
  await expect(page.getByText("Global", { exact: true })).toBeVisible();
  await expect(page.locator("[data-background-asset]")).toHaveAttribute(
    "sizes",
    "100vw",
  );

  const levelTargets = await page
    .getByRole("group", { name: "Complexity level" })
    .getByRole("button")
    .evaluateAll((buttons) =>
      buttons.map((button) => {
        const bounds = button.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      }),
    );
  expect(
    levelTargets.every(({ width, height }) => width >= 44 && height >= 44),
  ).toBe(true);

  await page.getByRole("button", { name: "Explore the evidence" }).click();
  await expect(
    page.getByRole("dialog", { name: "Why this number?" }),
  ).toBeVisible();
  const openSheetAccessibility = await new AxeBuilder({ page }).analyze();
  expect(openSheetAccessibility.violations).toEqual([]);
  await page.keyboard.press("Escape");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("reduced motion and a 200% desktop-equivalent viewport remain usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto("/compare", { waitUntil: "domcontentloaded" });

  const transitionSeconds = await page
    .getByRole("button", { name: "Explore the evidence" })
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

test("dark system preference keeps the mobile comparison readable", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/compare", { waitUntil: "domcontentloaded" });

  const heading = page.getByRole("heading", {
    level: 1,
    name: "See the energy trade-offs",
  });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("color", "rgb(247, 242, 232)");
  await expect(
    page.getByRole("button", { name: "Explore the evidence" }),
  ).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
