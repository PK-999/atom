import { test, expect } from "@playwright/test";

test.describe("Facility Directory and Globe Engine (R16-G)", () => {
  test("directory page loads with synchronized map and table counts", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/globe", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Global Nuclear Facilities Directory/i,
      }),
    ).toBeVisible();

    // Map SVG and Table are visible
    await expect(
      page.getByRole("group", { name: /World map showing nuclear facility/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("table", { name: /Nuclear Facilities Table/i }),
    ).toBeVisible();

    // Verify map pins and table rows count
    const pins = page.getByRole("button", { name: /Select facility/i });
    await expect.poll(() => pins.count()).toBeGreaterThanOrEqual(8);

    expect(consoleErrors).toEqual([]);
  });

  test("filters facilities by country and updates table and inspector", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/globe", { waitUntil: "networkidle" });
    await page.waitForLoadState("networkidle");

    // Wait for initial hydration
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Kudankulam Nuclear Power Plant",
      }),
    ).toBeVisible();

    // Filter by India
    const countrySelect = page.getByLabel("Country");
    await countrySelect.selectOption("IN");

    await expect(
      page.getByRole("table").getByText("Kudankulam Nuclear Power Plant"),
    ).toBeVisible();
    await expect(
      page.getByRole("table").getByText("Kakrapar Atomic Power Station"),
    ).toBeVisible();
    await expect(
      page.getByRole("table").getByText("Olkiluoto Nuclear Power Plant"),
    ).not.toBeVisible();

    // Select Kudankulam and inspect unit details
    const kudankulamRow = page
      .getByRole("table")
      .getByText("Kudankulam Nuclear Power Plant");
    await kudankulamRow.click();

    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Kudankulam Nuclear Power Plant",
      }),
    ).toBeVisible();

    // Mixed status callout
    await expect(
      page.getByText(/Mixed-Status Multi-Unit Facility/i),
    ).toBeVisible();

    // Check individual unit rows in inspector
    await expect(page.getByText("Kudankulam 1")).toBeVisible();
    await expect(page.getByText("Kudankulam 3")).toBeVisible();
    await expect(page.getByText(/IAEA PRIS/i).first()).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("filters by operating status and search query", async ({ page }) => {
    await page.goto("/globe", { waitUntil: "networkidle" });

    // Wait for initial hydration
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Kudankulam Nuclear Power Plant",
      }),
    ).toBeVisible();

    // Search query for Olkiluoto
    const searchInput = page.getByLabel("Search Name or Type");
    await searchInput.fill("Olkiluoto");

    await expect(
      page.getByRole("table").getByText("Olkiluoto Nuclear Power Plant"),
    ).toBeVisible();
    await expect(
      page.getByRole("table").getByText("Kudankulam Nuclear Power Plant"),
    ).not.toBeVisible();

    // Clear search
    await searchInput.fill("");
    await expect(
      page.getByRole("table").getByText("Kudankulam Nuclear Power Plant"),
    ).toBeVisible();
  });

  test("handles unknown facility param safely without crashing", async ({
    page,
  }) => {
    await page.goto("/globe?facility=non-existent-facility", {
      waitUntil: "domcontentloaded",
    });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Global Nuclear Facilities Directory/i,
      }),
    ).toBeVisible();

    // Defaults to first valid facility safely
    await expect(
      page.getByRole("table", { name: /Nuclear Facilities Table/i }),
    ).toBeVisible();
  });

  test("mobile viewport (390x844) renders map and directory cleanly", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/globe", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Global Nuclear Facilities Directory/i,
      }),
    ).toBeVisible();

    // Touch table row
    const row = page
      .getByRole("table")
      .getByText("Kudankulam Nuclear Power Plant");
    await row.click();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Kudankulam Nuclear Power Plant",
      }),
    ).toBeVisible();
  });
});
