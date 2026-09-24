import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.ATOM_QA_URL || "http://127.0.0.1:3102";
const width = Number(process.env.ATOM_QA_WIDTH || 390);
const routes = [
  "/",
  "/learn",
  "/learn/energy",
  "/learn/atom",
  "/learn/fission",
  "/learn/reactor",
  "/learn/waste",
  "/compare",
  "/grid",
  "/simulations",
  "/reactors",
  "/reactors/pwr",
  "/globe",
  "/how-it-works",
  "/radiation",
  "/myths",
  "/incidents",
  "/debates",
  "/debates/waste",
  "/topics",
  "/search",
  "/glossary",
  "/sources",
  "/evidence",
  "/methodology",
  "/about",
  "/ask",
];
const browser = await chromium.launch();
const results = [];
await mkdir("artifacts/experience", { recursive: true });
for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    colorScheme: theme,
    reducedMotion: "reduce",
  });
  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      const response = await page.goto(base + route);
      await page.locator("h1").first().waitFor();
      const axe = await new AxeBuilder({ page }).analyze();
      const overflow = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            return (
              b.width > 0 &&
              (b.right > innerWidth + 1 || b.left < -1) &&
              getComputedStyle(e).position !== "fixed" &&
              getComputedStyle(e).visibility !== "hidden"
            );
          })
          .slice(0, 8)
          .map((e) => ({
            tag: e.tagName,
            cls: e.className?.baseVal ?? e.className,
          })),
      );
      const result = {
        route,
        theme,
        width,
        status: response.status(),
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        overflowElements: overflow,
        errors,
        violations: axe.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes
            .slice(0, 6)
            .map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      };
      results.push(result);
      if (route === "/")
        await page.screenshot({
          path: `artifacts/experience/home-${theme}-${width}.png`,
          fullPage: true,
        });
      console.log(
        theme,
        route,
        result.overflow ? "OVERFLOW" : "",
        result.violations.map((v) => v.id).join(","),
        errors.length ? "ERROR" : "",
      );
    } catch (error) {
      results.push({ route, theme, width, error: String(error) });
      console.log("FAILED", route, String(error));
    }
    await page.close();
  }
  await context.close();
}
await writeFile(
  `artifacts/experience/audit-${width}.json`,
  JSON.stringify(results, null, 2),
);
await browser.close();
