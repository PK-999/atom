import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage journey is controllable and mobile navigation restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const action = page.getByRole("link", { name: "Start exploring →" });
  await expect(action).toBeVisible();
  expect((await action.boundingBox())!.y).toBeLessThan(700);
  await page.getByRole("button", { name: "3. Motion" }).click();
  await expect(
    page.getByText(/Expanding steam turns the turbine/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Step", exact: true }).click();
  await expect(
    page.getByText(/only part of the heat becomes electricity/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Explore ATOM" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeFocused();
});

test("fission preserves event and prediction across tabs, depth, theme and views", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/simulations");
  await page.getByRole("tab", { name: "Fission", exact: true }).click();
  await page.getByLabel("My prediction").selectOption("split");
  await page.getByRole("button", { name: "4. Split" }).click();
  await page.getByRole("button", { name: "1. Approach" }).click();
  await page.getByRole("button", { name: "4. Split" }).click();
  await expect(page.getByText(/Events in this replay: 1/)).toBeVisible();
  await page.getByRole("tab", { name: "Fuel Assembly" }).click();
  await page.getByRole("button", { name: "Explode assembly" }).click();
  await page.getByRole("tab", { name: "Fission", exact: true }).click();
  await expect(page.getByLabel("My prediction")).toHaveValue("split");
  await page.getByRole("button", { name: "Light theme" }).click();
  await expect(page.getByText(/Events in this replay: 1/)).toBeVisible();
  await page.getByRole("button", { name: "Inspect in 3D" }).click();
  await expect(page.locator("canvas")).toBeVisible();
  await page
    .locator("canvas")
    .evaluate((e) => e.scrollIntoView({ block: "center" }));
  const initialCamera = await page.locator("canvas").screenshot();
  await page.getByRole("button", { name: "Zoom in" }).click();
  expect(
    (await page.locator("canvas").screenshot()).equals(initialCamera),
  ).toBe(false);
  await page.getByRole("button", { name: "Reset view" }).click();
  await page
    .locator("canvas")
    .evaluate((e) => e.scrollIntoView({ block: "center" }));
  const resetCamera = await page.locator("canvas").screenshot();
  const difference = await page.evaluate(
    async ([before, after]) => {
      const pixels = async (src: string) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d")!;
        context.drawImage(img, 0, 0);
        return context.getImageData(0, 0, img.width, img.height).data;
      };
      const a = await pixels(before),
        b = await pixels(after);
      if (a.length !== b.length) return 255;
      let error = 0;
      for (let i = 0; i < a.length; i++) error += Math.abs(a[i] - b[i]);
      return error / a.length;
    },
    [initialCamera, resetCamera].map(
      (image) => "data:image/png;base64," + image.toString("base64"),
    ),
  );
  // Permit subpixel rasterization differences across Firefox/WebKit GPU backends.
  expect(difference).toBeLessThan(0.25);
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(page.locator("canvas")).toHaveCount(1);
  await page
    .locator("canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.getByText(/3D graphics are unavailable/)).toBeVisible();
  await expect(page.getByText(/Events in this replay: 1/)).toBeVisible();
});

for (const theme of ["light", "dark"] as const)
  for (const width of [320, 390, 768, 1440]) {
    test(`museum surfaces fit ${width}px in ${theme}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const route of ["/", "/simulations", "/learn/fission"]) {
        await page.goto(route);
        if (route === "/simulations")
          await page.getByRole("tab", { name: "Inside the Atom" }).click();
        await expect(page.locator("main")).toHaveCount(1);
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
          path: testInfo.outputPath(
            `${route.replaceAll("/", "_") || "home"}.png`,
          ),
          fullPage: true,
        });
      }
      expect(errors).toEqual([]);
    });
  }

test("playback reaches the final fission stage and depth preserves the experiment", async ({
  page,
}) => {
  await page.goto("/simulations");
  await page.waitForLoadState("networkidle");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("tab", { name: "Fission", exact: true }).click();
  await page.getByLabel("My prediction").selectOption("split");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByText(/Events in this replay: 1/)).toBeVisible({
    timeout: 8000,
  });
  await page.getByLabel("Reading depth", { exact: true }).selectOption("geeky");
  await expect(
    page.getByText(/not a Monte Carlo transport calculation/),
  ).toBeVisible();
  await expect(page.getByLabel("My prediction")).toHaveValue("split");
  await expect(page.getByText(/Events in this replay: 1/)).toBeVisible();
});

test("sound needs an explicit gesture and mute stops new cues", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const observations = { contexts: 0, starts: 0 };
    Object.assign(window, { atomAudioObservations: observations });
    const Original = window.AudioContext;
    window.AudioContext = class extends Original {
      constructor() {
        super();
        observations.contexts++;
      }
      createOscillator() {
        const node = super.createOscillator();
        const start = node.start.bind(node);
        node.start = (...args) => {
          observations.starts++;
          start(...args);
        };
        return node;
      }
    };
  });
  const observations = () =>
    page.evaluate(
      () =>
        (
          window as unknown as {
            atomAudioObservations: { contexts: number; starts: number };
          }
        ).atomAudioObservations,
    );
  await page.goto("/simulations");
  await page.getByRole("tab", { name: "Fission", exact: true }).click();
  expect(await observations()).toEqual({ contexts: 0, starts: 0 });
  await page.getByRole("button", { name: "Sound off", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sound on", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Step", exact: true }).click();
  await expect
    .poll(async () => (await observations()).starts)
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Sound on", exact: true }).click();
  const muted = await observations();
  await page.getByRole("button", { name: "Step", exact: true }).click();
  expect(await observations()).toEqual(muted);
  await expect(
    page.getByRole("button", { name: "Sound off", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
});
