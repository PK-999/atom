import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 390, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`cutaway diagrams remain readable and operable at ${width}px in ${theme}`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      const check = async () => {
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        expect((await new AxeBuilder({ page }).analyze()).violations).toEqual(
          [],
        );
      };
      const capture = async (name: string) => {
        if (
          testInfo.project.name === "chromium" &&
          theme === "dark" &&
          width !== 320
        ) {
          await page
            .locator('svg[aria-label*="schematic"]:visible')
            .first()
            .screenshot({
              path: `artifacts/schematics/${name}-${width}.png`,
              style: "header, header * { visibility: hidden !important; }",
            });
        }
      };
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page
        .getByRole("button", {
          name: `${theme === "dark" ? "Dark" : "Light"} theme`,
          exact: true,
        })
        .click();
      await page.getByRole("button", { name: "4. Electricity" }).click();
      const inspector = page.getByText("Inspect selected equipment", {
        exact: true,
      });
      await inspector.focus();
      await page.keyboard.press("Enter");
      await expect(
        page.getByRole("img", { name: "Enlarged generator cutaway" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "1. Heat" }).click();
      await expect(
        page.getByRole("img", { name: "Enlarged reactor vessel cutaway" }),
      ).toBeVisible();
      const animationNames = await page
        .locator("figure svg path")
        .evaluateAll((nodes) =>
          nodes.map((n) => getComputedStyle(n).animationName),
        );
      expect(animationNames.every((name) => name === "none")).toBe(true);
      await check();
      if (
        testInfo.project.name === "chromium" &&
        theme === "dark" &&
        width !== 320
      ) {
        await page.locator("figure").screenshot({
          path: `artifacts/schematics/energy-inspector-${width}.png`,
          style: "header, header * { visibility: hidden !important; }",
        });
      }
      await page.goto("/simulations", { waitUntil: "domcontentloaded" });
      for (const [tab, name] of [
        ["Inside the Atom", "atom"],
        ["Fuel Assembly", "fuel"],
        ["Fission", "fission"],
      ]) {
        await page.getByRole("tab", { name: tab, exact: true }).click();
        if (name === "fuel")
          await page.getByRole("button", { name: "Explode assembly" }).click();
        if (name === "fission")
          await page.getByRole("button", { name: "4. Split" }).click();
        await check();
        await capture(name);
      }
      for (const reactor of ["pwr", "bwr", "phwr", "smr", "htgr", "fbr"]) {
        await page.goto(`/reactors/${reactor}`, {
          waitUntil: "domcontentloaded",
        });
        const diagram = page.getByRole("group", {
          name: /Interactive schematic diagram/,
        });
        const component = diagram.getByRole("button").first();
        await component.focus();
        await page.keyboard.press("Enter");
        await expect(component).toHaveAttribute("aria-pressed", "true");
        await check();
        await capture(reactor);
      }
      expect(errors).toEqual([]);
    });
  }
}
