import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Comparison Lab V1 Acceptance & Regression Drills (R09)", () => {
  test("unreviewed categories never expose historical values or inferred rankings", async ({
    page,
  }) => {
    for (const metric of [
      "lifecycle-ghg",
      "capacity-factor",
      "land-use",
      "water-consumption",
      "lcoe",
      "mortality-rate",
      "fuel-energy-density",
      "thermal-efficiency",
    ]) {
      await page.goto(`/compare?metric=${metric}&sources=nuclear,solar`);
      await expect(
        page.getByRole("list", { name: "Accessible comparison summary" }),
      ).toContainText("We do not currently have reliable comparable data");
      await expect(
        page.getByText(/Missing evidence is not zero/),
      ).toBeVisible();
      await expect(
        page.getByText(/Fossil fuel estimates are much higher/),
      ).toHaveCount(0);
      await page
        .getByRole("button", {
          name: "Inspect evidence for Nuclear",
          exact: true,
        })
        .click();
      const passport = page.getByRole("dialog", { name: "Why this number?" });
      await expect(
        passport.getByText("No active reviewed version"),
      ).toBeVisible();
      await expect(passport.getByText("Not yet published")).toBeVisible();
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
    ).toContainText(
      "Nuclear: We do not currently have reliable comparable data",
    );

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
    ).toContainText(
      "Nuclear: We do not currently have reliable comparable data",
    );

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
      page.getByText(/Reviewed comparison evidence is not available/),
    ).toBeVisible();

    await page.goto("/compare?mode=range", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Range" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByText(/Reviewed comparison evidence is not available/),
    ).toBeVisible();

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
  });
});
