import { test, expect } from "@playwright/test";

test.describe("R12 Discovery, Search, Topics, Glossary, & Trust Routes", () => {
  test("homepage renders hero, three questions, featured exhibit, and topics", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Small atoms.*Big questions/,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Start exploring/ }),
    ).toHaveAttribute("href", "/learn");
    await expect(
      page.getByRole("region", { name: "Choose your next question" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Open the Comparison Lab/ }),
    ).toHaveAttribute("href", "/compare");
    await expect(
      page.getByRole("heading", { name: "Learn by trying." }),
    ).toBeVisible();
  });

  test("search form: empty guidance, query execution, and navigation to result", async ({
    page,
  }) => {
    await page.goto("/search");

    await expect(
      page.getByRole("heading", { name: "Search ATOM", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText("Suggested Searches")).toBeVisible();

    // Submit a query
    const searchInput = page.getByLabel("Search inquiry");
    await searchInput.fill("fission");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page).toHaveURL(/\/search\?q=fission/);
    await expect(
      page.getByText(/Found \d+ results? for “fission”/i),
    ).toBeVisible();

    // Results should include nuclear fission lesson
    const fissionResult = page
      .getByRole("link", { name: /Nuclear Fission/i })
      .first();
    await expect(fissionResult).toBeVisible();
    await fissionResult.click();

    // Navigated to /learn/fission
    await expect(page).toHaveURL(/\/learn\/fission/);
    await expect(
      page.getByRole("heading", { name: /Nuclear Fission/i, level: 1 }),
    ).toBeVisible();
  });

  test("topics directory and detail pages with 404 boundaries", async ({
    page,
  }) => {
    await page.goto("/topics");

    await expect(
      page.getByRole("heading", { name: "Curriculum Topics", level: 1 }),
    ).toBeVisible();

    // Navigate to topic
    await page.getByRole("link", { name: "Energy Fundamentals" }).click();
    await expect(page).toHaveURL(/\/topics\/fundamentals/);
    await expect(
      page.getByRole("heading", { name: "Energy Fundamentals", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText("Core Themes & Knowledge Areas")).toBeVisible();

    // 404 boundary
    const response = await page.goto("/topics/non-existent-topic");
    expect(response?.status()).toBe(404);
  });

  test("glossary directory and term detail with 404 boundaries", async ({
    page,
  }) => {
    await page.goto("/glossary");

    await expect(
      page.getByRole("heading", {
        name: /Energy & Nuclear Glossary/i,
        level: 1,
      }),
    ).toBeVisible();

    // Navigate to a term
    await page.getByRole("link", { name: "Half-life" }).first().click();
    await expect(page).toHaveURL(/\/glossary\/half-life/);
    await expect(
      page.getByRole("heading", { name: "Half-life", level: 1 }),
    ).toBeVisible();
    await expect(page.getByText("Authoritative Reference")).toBeVisible();

    // 404 boundary
    const response = await page.goto("/glossary/unknown-term-xyz");
    expect(response?.status()).toBe(404);
  });

  test("trust and governance routes resolve with correct headings", async ({
    page,
  }) => {
    // About
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "About ATOM", level: 1 }),
    ).toBeVisible();

    await page.goto("/methodology");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "How ATOM Handles Evidence",
    );

    // Evidence
    await page.goto("/evidence");
    await expect(
      page.getByRole("heading", { name: "Evidence Directory", level: 1 }),
    ).toBeVisible();
  });
});
