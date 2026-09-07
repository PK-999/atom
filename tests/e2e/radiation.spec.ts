import { test, expect } from "@playwright/test";

test.describe("R13 Radiation Explorer: Logarithmic Dose Comparisons", () => {
  test("loads /radiation and displays header, disclaimer, and scale", async ({
    page,
  }) => {
    await page.goto("/radiation", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Radiation Dose Explorer", level: 1 }),
    ).toBeVisible();

    // Educational and physical disclaimer
    const disclaimer = page.getByTestId("disclaimer");
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText(
      "Absorbed dose (Gy) cannot be directly converted to effective dose (Sv)",
    );

    // Inspector card
    await expect(page.getByTestId("scenario-inspector")).toBeVisible();

    // Logarithmic scale axis
    await expect(
      page.getByRole("heading", {
        name: /Logarithmic Exposure Continuum/i,
      }),
    ).toBeVisible();
  });

  test("filters scenarios by category and updates visual list and table", async ({
    page,
  }) => {
    await page.goto("/radiation", { waitUntil: "domcontentloaded" });

    // Click "Medical Diagnostics" filter
    const medicalBtn = page.getByTestId("filter-medical");
    await medicalBtn.click();
    await expect(medicalBtn).toHaveAttribute("aria-pressed", "true");

    // Standard chest x-ray should be present in the scenario list
    await expect(page.getByTestId("scenario-row-chest-xray")).toBeVisible();

    // Everyday banana intake should be hidden
    await expect(
      page.getByTestId("scenario-row-banana-intake"),
    ).not.toBeVisible();

    // Restore to all
    await page.getByTestId("filter-all").click();
    await expect(page.getByTestId("scenario-row-banana-intake")).toBeVisible();
  });

  test("interactively selects scenario and updates inspector details", async ({
    page,
  }) => {
    await page.goto("/radiation", { waitUntil: "domcontentloaded" });

    // Click on Transcontinental Flight row
    const flightRow = page.getByTestId("scenario-row-flight-transcontinental");
    await flightRow.click();
    await expect(flightRow).toHaveAttribute("aria-selected", "true");

    const inspector = page.getByTestId("scenario-inspector");
    await expect(inspector).toBeVisible();
    await expect(inspector).toContainText("Transcontinental Flight (NY to LA)");
    await expect(inspector).toContainText("40 µSv");
    await expect(inspector).toContainText("FAA");
  });

  test("accessible reference table contains all scenarios with correct headers", async ({
    page,
  }) => {
    await page.goto("/radiation", { waitUntil: "domcontentloaded" });

    const table = page.getByRole("table", {
      name: "Radiation Scenarios Reference Table",
    });
    await expect(table).toBeVisible();

    // Verify key columns
    await expect(
      table.getByRole("columnheader", { name: "Scenario" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Dose (µSv)" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Dose (mSv)" }),
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Authoritative Source" }),
    ).toBeVisible();

    // Verify row
    await expect(
      table.getByRole("rowheader", { name: "Lethal Dose (LD50/30)" }),
    ).toBeVisible();
  });
});
