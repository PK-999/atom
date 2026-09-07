import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { METRICS } from "../../lib/evidence/metrics";

test.describe("Comparison Lab Regression Drills", () => {
  test("cross-category URL parameters render without console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        consoleErrors.push(message.text());
      }
    });

    for (const metric of METRICS) {
      // Load compare route with every metric
      await page.goto(`/compare?metric=${metric.id}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Ensure the chart or table renders without throwing hydration errors
      const exhibit = page.locator("#comparison-exhibit");
      await expect(exhibit).toBeVisible();
    }

    // Some external warnings might exist, but we expect no hydration or crash errors
    expect(
      consoleErrors.filter(
        (err) =>
          err.includes("Hydration") || err.includes("Minified React error"),
      ),
    ).toEqual([]);
  });

  test("Raw-mode and Range-mode URL configurations handle fallback gracefully", async ({
    page,
  }) => {
    // Stage 16 raw/range test
    await page.goto("/compare?mode=raw", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Raw" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.goto("/compare?mode=range", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "Range" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
  });
});
