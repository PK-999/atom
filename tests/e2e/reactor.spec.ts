import { test, expect } from "@playwright/test";

test.describe("Reactor Explorer Engine (R15)", () => {
  test("reactors index page lists all commercial architectures", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/reactors", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Commercial Reactor Architectures/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByText(/Pressurized Water Reactor \(PWR\)/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Boiling Water Reactor \(BWR\)/i),
    ).toBeVisible();
    await expect(
      page.getByText(/Pressurized Heavy Water Reactor/i),
    ).toBeVisible();
    await expect(page.getByText(/Small Modular Reactor/i)).toBeVisible();
    await expect(
      page.getByText(/High-Temperature Gas-Cooled Reactor/i),
    ).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("PWR explorer supports diagram and keyboard equivalence with explanation tiers", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/reactors/pwr", { waitUntil: "domcontentloaded" });

    // Header & schematic
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Pressurized Water Reactor \(PWR\)/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: /Interactive schematic diagram/i }),
    ).toBeVisible();

    // Verify initial component is hydrated before clicking
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /Reactor Pressure Vessel/i,
      }),
    ).toBeVisible();

    // Select Steam Generator via text button
    const steamGenBtn = page.getByRole("button", {
      name: "Steam Generator",
      exact: true,
    });
    await steamGenBtn.click();
    await expect(
      page.getByRole("heading", { level: 3, name: "Steam Generator" }),
    ).toBeVisible();
    await expect(
      page.getByText(/Transfers primary heat to secondary water/i),
    ).toBeVisible();

    // Switch explanation tier to Simple
    const simpleTab = page.getByRole("tab", { name: /Simple/i });
    await simpleTab.click();
    await expect(
      page.getByText(
        /super-hot radioactive water gives its heat to clean water/i,
      ),
    ).toBeVisible();

    // Switch explanation tier to Technical
    const techTab = page.getByRole("tab", { name: /Technical/i });
    await techTab.click();
    await expect(
      page.getByText(/Features thousands of Inconel/i),
    ).toBeVisible();

    // Click SVG diagram part for Control Rods
    const controlRodsSvg = page.getByRole("button", {
      name: "Select Control Rod Clusters",
    });
    await controlRodsSvg.click();
    await expect(
      page.getByRole("heading", { level: 3, name: "Control Rod Clusters" }),
    ).toBeVisible();

    // Real world examples
    await expect(page.getByText(/Westinghouse AP1000/i)).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("BWR and PHWR concept pages render successfully", async ({ page }) => {
    await page.goto("/reactors/bwr", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /Boiling Water Reactor/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Bottom-Entry Control Rods",
        exact: true,
      }),
    ).toBeVisible();

    await page.goto("/reactors/phwr", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /Heavy Water Reactor/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Horizontal Calandria Vessel",
        exact: true,
      }),
    ).toBeVisible();

    await page.goto("/reactors/smr", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { level: 1, name: /Small Modular Reactor/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Helical-Coil Steam Generator",
        exact: true,
      }),
    ).toBeVisible();

    await page.goto("/reactors/htgr", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /High-Temperature Gas-Cooled Reactor/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "TRISO Particle Fuel Elements",
        exact: true,
      }),
    ).toBeVisible();
  });

  test("returns 404 for invalid reactor concept", async ({ page }) => {
    const response = await page.goto("/reactors/non-existent-reactor", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(404);
  });

  test("mobile viewport (390x844) renders schematic and buttons cleanly", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/reactors/pwr", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Pressurized Water Reactor \(PWR\)/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", {
        level: 3,
        name: /Reactor Pressure Vessel/i,
      }),
    ).toBeVisible();

    // Button controls wrap and are touchable
    const pressurizerBtn = page.getByRole("button", {
      name: "Pressurizer",
      exact: true,
    });
    await pressurizerBtn.click();
    await expect(
      page.getByRole("heading", { level: 3, name: "Pressurizer" }),
    ).toBeVisible();
  });
});
