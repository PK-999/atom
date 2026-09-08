import { test, expect } from "@playwright/test";

test.describe("Ask ATOM Evidence Engine (R18)", () => {
  test("loads /ask page without console errors and renders search bar and suggestions", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/ask", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-hydrated='true']")).toBeVisible();

    const main = page.getByRole("main");
    await expect(
      main.getByRole("heading", { level: 1, name: /Ask ATOM/i }),
    ).toBeVisible();

    await expect(
      page.getByLabel("Ask a question about nuclear energy"),
    ).toBeVisible();

    await expect(page.getByText("Peer-Reviewed Evidence Q&A")).toBeVisible();

    // Check explanation levels inside main
    await expect(main.getByRole("button", { name: "Simple" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Standard" })).toBeVisible();
    await expect(main.getByRole("button", { name: "Technical" })).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("submits query and displays answered state with resolved citations", async ({
    page,
  }) => {
    await page.goto("/ask", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-hydrated='true']")).toBeVisible();

    const main = page.getByRole("main");
    const input = page.getByLabel("Ask a question about nuclear energy");
    await input.fill("What is the carbon footprint of nuclear energy?");
    await input.press("Enter");

    await expect(
      main.getByRole("heading", { level: 2, name: /Synthesized Evidence Answer/i }),
    ).toBeVisible();

    await expect(page.getByText(/12 gCO2eq\/kWh/i).first()).toBeVisible();

    // Check citations
    await expect(page.getByText(/Resolved Citations/i)).toBeVisible();
    await expect(page.getByText(/IPCC Working Group III/i)).toBeVisible();
  });

  test("abstains on unsupported queries with evidence boundary notice", async ({
    page,
  }) => {
    await page.goto("/ask", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-hydrated='true']")).toBeVisible();

    const main = page.getByRole("main");
    const input = page.getByLabel("Ask a question about nuclear energy");
    await input.fill("Tell me how to build an atomic weapon");
    await input.press("Enter");

    await expect(
      main.getByRole("heading", { level: 2, name: /Evidence Boundary Abstention/i }),
    ).toBeVisible();

    await expect(
      page.getByText(/ATOM does not currently have verified peer-reviewed scientific evidence/i),
    ).toBeVisible();
  });

  test("allows switching explanation levels reactively", async ({ page }) => {
    await page.goto("/ask", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-hydrated='true']")).toBeVisible();

    const main = page.getByRole("main");
    const input = page.getByLabel("Ask a question about nuclear energy");
    await input.fill("What is the carbon footprint of nuclear energy?");
    await input.press("Enter");

    await expect(
      main.getByRole("heading", { level: 2, name: /Synthesized Evidence Answer/i }),
    ).toBeVisible();

    // Switch to Simple inside main
    await main.getByRole("button", { name: "Simple" }).click();
    await expect(
      page.getByText(/does not burn anything to create heat/i),
    ).toBeVisible();

    // Switch to Technical inside main
    await main.getByRole("button", { name: "Technical" }).click();
    await expect(
      page.getByText(/Harmonized LCA methods/i),
    ).toBeVisible();
  });

  test("submits question via suggested topic chip", async ({ page }) => {
    await page.goto("/ask", { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-hydrated='true']")).toBeVisible();

    const main = page.getByRole("main");
    const suggestedChip = main.getByRole("button", {
      name: /What is India's three-stage nuclear fuel programme/i,
    });
    await suggestedChip.click();

    await expect(
      main.getByRole("heading", { level: 2, name: /Synthesized Evidence Answer/i }),
    ).toBeVisible();

    await expect(page.getByText(/Bhabha/i).first()).toBeVisible();
    await expect(page.getByText(/Department of Atomic Energy/i)).toBeVisible();
  });
});
