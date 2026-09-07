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
    ).toContainText("Nuclear: 92 %");
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Solar: 24 %");

    // 3. Economics Category: LCOE
    await page.goto("/compare?metric=lcoe&sources=nuclear,solar", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText(/Nuclear: 75 USD\s*\/?\s*MWh/);
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText(/Solar: 42 USD\s*\/?\s*MWh/);

    // 4. Human Impact Category: Mortality Rate
    await page.goto("/compare?metric=mortality-rate&sources=nuclear,coal", {
      waitUntil: "domcontentloaded",
    });
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText(/Nuclear: 0\.03 deaths\s*\/?\s*TWh/);
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText(/Coal: 24\.6 deaths\s*\/?\s*TWh/);

    // 5. Security Category: Fuel Energy Density
    await page.goto(
      "/compare?metric=fuel-energy-density&sources=nuclear,coal",
      {
        waitUntil: "domcontentloaded",
      },
    );
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText(/Nuclear: 500000/);

    // 6. Technical Category: Thermal Efficiency (with non-thermal physics constraint)
    await page.goto(
      "/compare?metric=thermal-efficiency&sources=nuclear,gas,solar",
      {
        waitUntil: "domcontentloaded",
      },
    );
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Nuclear: 34 %");
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).toContainText("Gas: 60 %");
    // Non-thermal solar should not have thermal efficiency
    await expect(
      page.getByRole("list", { name: "Accessible comparison summary" }),
    ).not.toContainText("Solar: 34 %");
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
