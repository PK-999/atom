import { test, expect } from "@playwright/test";

test.describe("Debates Engine (R14)", () => {
  test("debates index renders all published debate topics and category counts", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/debates", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /core nuclear debates/i }),
    ).toBeVisible();

    // Check all three topics
    await expect(page.getByText(/How should nuclear waste/i)).toBeVisible();
    await expect(
      page.getByText(/Is nuclear energy too expensive/i),
    ).toBeVisible();
    await expect(
      page.getByText(/How does the safety of nuclear energy compare/i),
    ).toBeVisible();

    // Check relationship badges on cards
    await expect(page.getByText(/Supporting/i).first()).toBeVisible();
    await expect(page.getByText(/Disputing/i).first()).toBeVisible();
    await expect(page.getByText(/Contextual/i).first()).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("waste debate topic displays attributable consensus, uncertainty, and 3 relationships", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/debates/waste", { waitUntil: "domcontentloaded" });

    // Heading
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /How should nuclear waste/i,
      }),
    ).toBeVisible();

    // Attributable consensus
    await expect(
      page.getByText(/State of Scientific Consensus/i),
    ).toBeVisible();
    await expect(
      page.getByText(/broad international consensus/i),
    ).toBeVisible();
    await expect(page.getByText(/Attributable Basis:/i)).toBeVisible();
    await expect(page.getByText(/As of: 2026-01-15/i).first()).toBeVisible();

    // Attributable uncertainty
    await expect(
      page.getByText(/Key Uncertainties & Open Questions/i),
    ).toBeVisible();
    await expect(page.getByText(/political consent/i)).toBeVisible();

    // All three relationships visible
    await expect(page.getByText(/Compact physical volume/i)).toBeVisible();
    await expect(page.getByText(/Extreme radiotoxic lifespans/i)).toBeVisible();
    await expect(
      page.getByText(/Decades of safe dry-cask storage/i),
    ).toBeVisible();

    // Filter interaction
    const disputingBtn = page.getByRole("button", { name: /Disputing/i });
    await disputingBtn.click();
    await expect(page.getByText(/Extreme radiotoxic lifespans/i)).toBeVisible();
    await expect(page.getByText(/Compact physical volume/i)).not.toBeVisible();

    const allBtn = page.getByRole("button", { name: /^All/i });
    await allBtn.click();
    await expect(page.getByText(/Compact physical volume/i)).toBeVisible();

    // Expandable sources
    const viewSourcesBtn = page
      .getByRole("button", { name: /View Sources/i })
      .first();
    await viewSourcesBtn.click();
    await expect(
      page.getByRole("link", { name: /Status and Trends in Spent Fuel/i }),
    ).toBeVisible();

    // Missing evidence callout
    await expect(page.getByText(/Evidence Boundary & Gaps/i)).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("costs and safety debate pages render successfully", async ({
    page,
  }) => {
    await page.goto("/debates/costs", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /too expensive/i }),
    ).toBeVisible();
    await expect(page.getByText(/LCOE/i).first()).toBeVisible();

    await page.goto("/debates/safety", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /safety of nuclear/i }),
    ).toBeVisible();
    await expect(page.getByText(/UNSCEAR/i).first()).toBeVisible();
  });

  test("returns 404 for invalid debate slug", async ({ page }) => {
    const response = await page.goto("/debates/non-existent-topic", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(404);
  });

  test("mobile viewport (390x844) renders debate experience cleanly", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/debates/waste", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /How should nuclear waste/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(/State of Scientific Consensus/i),
    ).toBeVisible();

    // Check filter buttons are clickable without overflow
    const contextualBtn = page.getByRole("button", { name: /Contextual/i });
    await contextualBtn.click();
    await expect(
      page.getByText(/Decades of safe dry-cask storage/i),
    ).toBeVisible();
  });
});
