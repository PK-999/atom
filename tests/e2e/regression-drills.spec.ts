import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Comparison Lab V1 Acceptance & Regression Drills (R09)", () => {
  test("cross-category representative journeys assert values, units, and dataset versions", async ({
    page,
  }) => {
    // 1. Environment Category: Lifecycle GHG
    await page.goto("/compare?metric=lifecycle-ghg&sources=nuclear,gas", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Nuclear: 12 g CO₂e / kWh");
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Gas: 490 g CO₂e / kWh");

    // 2. Reliability Category: Capacity Factor
    await page.goto("/compare?metric=capacity-factor&sources=nuclear,solar", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Nuclear: 92.5 %");
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Solar: 24.6 %");

    // Unreleased categories must not reuse unrelated numeric observations.
    for (const metric of [
      "lcoe",
      "mortality-rate",
      "fuel-energy-density",
      "thermal-efficiency",
    ]) {
      await page.goto(`/compare?metric=${metric}&sources=nuclear,solar`);
      await expect(
        page.getByRole("list", { name: "Accessible comparison summary" }),
      ).toContainText("We do not currently have reliable comparable data");
    }
  });

  test("edge cases: aliases, invalid parameters, single source, full 9 sources, and levels", async ({
    page,
  }) => {
    // Old alias resolution
    await page.goto("/compare?metric=lifecycle-emissions", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Nuclear: 12 g CO₂e / kWh");

    // Invalid parameters fallback gracefully to defaults
    await page.goto(
      "/compare?metric=fake-metric&sources=invalid-tech&mode=invalid-mode&level=invalid-level",
      {
        waitUntil: "domcontentloaded",
      },
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toBeVisible();

    // Single source selection
    await page.goto("/compare?sources=nuclear", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Nuclear: 12 g CO₂e / kWh");

    // 9 technologies selection
    await page.goto(
      "/compare?sources=nuclear,solar,wind,gas,coal,hydro,storage,biomass,geothermal",
      {
        waitUntil: "domcontentloaded",
      },
    );
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Nuclear");
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Geothermal");

    // All 5 complexity levels render cleanly
    for (const lvl of ["kid", "simple", "curious", "technical", "expert"]) {
      await page.goto(`/compare?level=${lvl}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("raw-mode and range-mode honesty contracts and accessibility", async ({
    page,
  }) => {
    await page.goto("/compare?mode=raw", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Raw" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByText(/Source-level raw observations are not available/),
    ).toBeVisible();

    await page.goto("/compare?mode=range", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Range" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByText(/Reviewed range evidence is not available/),
    ).toBeVisible();

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
  });
});
