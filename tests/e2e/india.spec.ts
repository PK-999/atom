import { test, expect } from "@playwright/test";

test.describe("India Energy & Nuclear Profile (R16-I)", () => {
  test("loads /india page without console errors and renders full profile", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/india", { waitUntil: "domcontentloaded" });

    // Header & metadata
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /India Energy & Nuclear Profile/i,
      }),
    ).toBeVisible();

    await expect(page.getByText(/National Profile · IN/i)).toBeVisible();
    await expect(page.getByText(/Fiscal Year 2023-24/i)).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("renders fleet status metrics accurately", async ({ page }) => {
    await page.goto("/india", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Commercial Reactor Fleet Status/i,
      }),
    ).toBeVisible();

    // Key fleet statistics
    await expect(page.getByText("24", { exact: true })).toBeVisible();
    await expect(page.getByText("8,180 MWe", { exact: true })).toBeVisible();
    await expect(page.getByText("8", { exact: true })).toBeVisible();
    await expect(page.getByText("6,800 MWe", { exact: true })).toBeVisible();
    await expect(page.getByText("10", { exact: true })).toBeVisible();
  });

  test("renders capacity vs generation table and energy literacy insight callout", async ({
    page,
  }) => {
    await page.goto("/india", { waitUntil: "domcontentloaded" });

    // Insight callout
    await expect(
      page.getByRole("region", { name: /Capacity versus generation insight/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Installed Capacity ≠ Actual Generation/i),
    ).toBeVisible();

    // Table verification
    const table = page.getByRole("table", {
      name: /India Electricity Capacity and Generation Breakdown/i,
    });
    await expect(table).toBeVisible();

    // Check table headers
    await expect(
      table.getByRole("columnheader", { name: "Energy Source" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Capacity (GW)" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Capacity Share (%)" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Generation (TWh)" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Generation Share (%)" }),
    ).toBeVisible();

    // Check nuclear and solar entries
    await expect(table.getByText("Nuclear")).toBeVisible();
    await expect(table.getByText("1.85%")).toBeVisible();
    await expect(table.getByText("2.75%")).toBeVisible();

    await expect(table.getByText("Solar PV")).toBeVisible();
    await expect(table.getByText("18.47%")).toBeVisible();
    await expect(table.getByText("6.67%")).toBeVisible();
  });

  test("renders all three stages of the Bhabha nuclear programme with fuel cycles", async ({
    page,
  }) => {
    await page.goto("/india", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Bhabha Three-Stage Nuclear Programme/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /Stage 1: Pressurized Heavy Water Reactors/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /Stage 2: Fast Breeder Reactors/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /Stage 3: Advanced Thorium Reactors/i,
      }),
    ).toBeVisible();

    // Fuel flow details
    await expect(page.getByText(/Natural Uranium \(0.7% U-235/i)).toBeVisible();
    await expect(
      page.getByText(/Plutonium-239 \+ Uranium-238 MOX/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Thorium-232 \+ Bred Uranium-233/i),
    ).toBeVisible();
  });

  test("renders long-term scenarios and primary citations", async ({
    page,
  }) => {
    await page.goto("/india", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /Long-Term Capacity Targets & Net Zero Scenarios/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /2032 Horizon: 22.4 GW Nuclear Target/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /2047 Horizon: 100 GW Nuclear Target/i,
      }),
    ).toBeVisible();

    // Primary citations
    await expect(
      page.getByRole("link", { name: /Executive Summary of Power Sector/i }),
    ).toHaveAttribute("href", "https://cea.nic.in");
    await expect(
      page.getByRole("link", {
        name: /Department of Atomic Energy Annual Report/i,
      }),
    ).toHaveAttribute("href", "https://dae.gov.in");
  });
});
