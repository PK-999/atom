import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.ATOM_QA_URL || "https://atom-opal-omega.vercel.app";
const browser = await chromium.launch();
const results = [];
try {
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of [
      "/",
      "/learn",
      "/learn/fission",
      "/compare",
      "/simulations",
      "/reactors/pwr",
      "/globe",
    ]) {
      const response = await page.goto(base + route);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      const axe = await new AxeBuilder({ page }).analyze();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      const result = {
        route,
        theme,
        status: response.status(),
        overflow,
        violations: axe.violations.map((v) => v.id),
      };
      results.push(result);
      expect(result.status).toBe(200);
      expect(overflow).toBe(false);
      expect(result.violations).toEqual([]);
    }
    await page.goto(base + "/");
    await page.getByRole("button", { name: "3. Motion" }).click();
    await expect(
      page.getByText(/Expanding steam turns the turbine/),
    ).toBeVisible();
    await page
      .getByRole("button", {
        name: theme === "light" ? "Dark theme" : "Light theme",
      })
      .click();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      theme === "light" ? "dark" : "light",
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      theme === "light" ? "dark" : "light",
    );
    await page.goto(base + "/simulations");
    await page.getByRole("tab", { name: "Fission", exact: true }).click();
    await page.getByRole("button", { name: "4. Split" }).click();
    await page.getByRole("button", { name: "1. Approach" }).click();
    await page.getByRole("button", { name: "4. Split" }).click();
    await expect(page.getByText(/Events in this replay: 1/)).toBeVisible();
    await page.getByRole("button", { name: "Inspect in 3D" }).click();
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });
    await page
      .locator("canvas")
      .evaluate((e) =>
        e.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
      );
    await expect(page.getByText(/3D graphics are unavailable/)).toBeVisible();
    await expect(page.getByText(/Events in this replay: 1/)).toBeVisible();
    expect(errors).toEqual([]);
    results.push({
      theme,
      journeys:
        "homepage step; explicit theme and reload; idempotent fission; 3D and context-loss fallback",
      pageErrors: errors,
    });
    await context.close();
  }
  const health = await fetch(base + "/health");
  expect(health.status).toBe(200);
  expect(await health.json()).toEqual({ status: "ok" });
  console.log(
    "Production smoke passed: 14 route/theme states and 2 interactive journeys.",
  );
} finally {
  await mkdir("artifacts/experience", { recursive: true });
  await writeFile(
    "artifacts/experience/production-smoke.json",
    JSON.stringify(
      { base, verifiedAt: new Date().toISOString(), results },
      null,
      2,
    ) + "\n",
  );
  await browser.close();
}
