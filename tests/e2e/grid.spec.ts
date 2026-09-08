import { test, expect } from "@playwright/test";

test.describe("Annual Grid Learning Simulator (R17)", () => {
  test("loads /grid page without console errors and renders default scenario", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/grid", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Annual Electricity Grid Simulator/i,
      }),
    ).toBeVisible();

    await expect(page.getByText("8760 Hours (Standard Year)")).toBeVisible();
    await expect(
      page.getByText("Annual Energy Coverage", { exact: true }),
    ).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("allows switching presets and updates scenario values", async ({
    page,
  }) => {
    await page.goto("/grid", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Annual Electricity Grid Simulator/i,
      }),
    ).toBeVisible();

    const presetSelect = page.getByLabel("Load Scenario:");
    await expect(presetSelect).toBeVisible();

    await presetSelect.selectOption("nuclear-firm-base");

    // Nuclear capacity in this preset is 5,000 MW
    await expect(page.getByText("5,000 MW").first()).toBeVisible();
  });

  test("handles leap year selection and updates hours to 8784", async ({
    page,
  }) => {
    await page.goto("/grid", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Annual Electricity Grid Simulator/i,
      }),
    ).toBeVisible();

    const yearInput = page.getByLabel("Year:");
    await yearInput.fill("2024");
    await yearInput.dispatchEvent("change");

    await expect(page.getByText("8784 Hours (Leap Year)")).toBeVisible();
  });

  test("recalculates reactively when capacity or demand is modified", async ({
    page,
  }) => {
    await page.goto("/grid", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Annual Electricity Grid Simulator/i,
      }),
    ).toBeVisible();

    // Fill annual demand numeric input
    const demandInput = page.getByLabel("Annual Demand Numeric Input in MWh");
    await demandInput.fill("100000000"); // 100 TWh
    await demandInput.dispatchEvent("change");

    await expect(page.getByText("100.00 TWh")).toBeVisible();

    // Check shortfall status
    await expect(page.getByText("Annual Energy Shortfall")).toBeVisible();
  });

  test("renders breakdown table and educational reliability disclaimer", async ({
    page,
  }) => {
    await page.goto("/grid", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Annual Electricity Grid Simulator/i,
      }),
    ).toBeVisible();

    // Table verification
    const table = page.getByRole("table", {
      name: /Annual Generation Simulation Breakdown Table/i,
    });
    await expect(table).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Technology" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Capacity (MW)" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Gen Share (%)" }),
    ).toBeVisible();

    // Educational callout verification
    await expect(
      page.getByRole("region", {
        name: /Core Concept: Annual Energy Balance ≠ Real-Time Hourly Reliability/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/Hourly Intermittency & The "Dunkelflaute"/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Mechanical Grid Inertia & Frequency/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Seasonal Storage Requirements/i),
    ).toBeVisible();
  });
});
