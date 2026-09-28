import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("legacy preferences stay inert while theme, answers and completed lessons survive", async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("migration-seeded")) return;
    localStorage.setItem("atom:preferences:v1:complexity", "kid");
    localStorage.setItem("atom:preferences:v2:complexity", "geeky");
    localStorage.setItem("atom:preferences:v1:theme", "dark");
    localStorage.setItem(
      "atom:learning-progress:v1",
      JSON.stringify({
        lessons: { energy: { version: "1.0.0", completed: true } },
        checkpointAnswers: { "chk-energy-density": "opt-b" },
        lastAccessedLesson: "energy",
      }),
    );
    sessionStorage.setItem("migration-seeded", "yes");
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    const accesses: string[] = [];
    Object.assign(window, { readingPreferenceAccesses: accesses });
    Storage.prototype.getItem = function (key) {
      if (key.endsWith(":complexity")) accesses.push(`read:${key}`);
      return originalGet.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key.endsWith(":complexity")) accesses.push(`write:${key}`);
      return originalSet.call(this, key, value);
    };
  });
  await page.goto("/learn/energy?level=expert&path=fundamentals#lesson-title");
  await expect(page.getByTestId("completed-badge")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByLabel("Reading depth")).toHaveCount(0);
  await page.locator("#lesson-prediction").fill("Run the lamp for longer.");
  const answer = page
    .getByTestId("lesson-checkpoint")
    .getByRole("radio")
    .first();
  await answer.check();
  const context = page.getByText("Why does fuel energy density matter?", {
    exact: true,
  });
  await context.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Energy per kilogram affects/)).toBeVisible();
  await expect(page.locator("#lesson-prediction")).toHaveValue(
    "Run the lamp for longer.",
  );
  expect(new URL(page.url()).searchParams.get("path")).toBe("fundamentals");
  expect(new URL(page.url()).hash).toBe("#lesson-title");
  await expect(answer).toBeChecked();
  const accesses = await page.evaluate(
    () =>
      (window as unknown as { readingPreferenceAccesses: string[] })
        .readingPreferenceAccesses,
  );
  expect(accesses).toEqual([]);
  await page.getByRole("button", { name: "Light theme" }).click();
  await page.reload();
  await expect(page.getByTestId("completed-badge")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("atom:learning-progress:v1")!)
          .checkpointAnswers,
    ),
  ).toEqual({ "chk-energy-density": "opt-b" });
  expect(
    await page.evaluate(() =>
      localStorage.getItem("atom:preferences:v1:complexity"),
    ),
  ).toBe("kid");
});

for (const theme of ["light", "dark"] as const)
  for (const width of [320, 390, 1440]) {
    test(`single reading surfaces support details and fit at ${width}px in ${theme}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      for (const route of [
        "/explore",
        "/myths",
        "/incidents",
        "/how-it-works",
        "/ask",
        "/reactors/pwr",
      ]) {
        await page.goto(`${route}?level=beginner`);
        await expect(page.getByLabel("Reading depth")).toHaveCount(0);
        await expect(page.getByRole("main")).toHaveCount(1);
        const details = page.locator("main details > summary").first();
        if (await details.count()) {
          await details.focus();
          await page.keyboard.press("Enter");
          await expect(details.locator("..")).toHaveAttribute("open", "");
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        const axe = await new AxeBuilder({ page }).analyze();
        expect(
          axe.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
        ).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(`${route.replaceAll("/", "_")}.png`),
          fullPage: true,
        });
      }
      expect(errors).toEqual([]);
    });
  }
