import { expect, test } from "@playwright/test";

test("reactor keeps its canvas when power, theme, and selection change", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "WebGL lifecycle uses Chromium; all browsers exercise the fallback separately.",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/reactors/pwr");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /3D Digital Model/ }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toBeVisible({ timeout: 15000 });
  await canvas.evaluate((e) => e.setAttribute("data-original", "true"));
  await page.getByRole("radio", { name: /50% Reduced/ }).click();
  await page.getByRole("button", { name: "Dark theme" }).click();
  await page
    .getByRole("button", { name: "Steam Generator", exact: true })
    .click();
  await expect(canvas).toHaveAttribute("data-original", "true");
  await expect(
    page.getByRole("heading", { level: 3, name: "Steam Generator" }),
  ).toBeVisible();
  await canvas.evaluate((e) =>
    e.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
  );
  await expect(
    page.getByRole("status").filter({ hasText: "3D graphics are unavailable" }),
  ).toBeVisible();
  await expect(
    page.getByRole("group", { name: /Interactive schematic/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "Steam Generator" }),
  ).toBeVisible();
});

for (const [route, button] of [
  ["/globe", "3D Globe"],
  ["/reactors/pwr", "3D Digital Model"],
] as const) {
  test(`graphics failure on ${route} preserves readable selection`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        if (/webgl/.test(type)) return null;
        return Reflect.apply(original, this, [type, ...args]);
      } as typeof original;
    });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: new RegExp(button) }).click();
    await expect(
      page
        .getByRole("status")
        .filter({ hasText: "3D graphics are unavailable" }),
    ).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const [route, open, rotate] of [
  ["/reactors/pwr", "3D Digital Model", "Auto Orbit"],
  ["/globe", "3D Globe", "Resume 3D rotation"],
] as const) {
  test(`${route} stops idle drawing and resumes chosen rotation after reduced motion`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Draw-call instrumentation uses Chromium WebGL.",
    );
    await page.addInitScript(() => {
      const counts = { draws: 0 };
      Object.assign(window, { atomDrawCounts: counts });
      const proto = WebGL2RenderingContext.prototype;
      const draw = proto.drawElements;
      proto.drawElements = function (...args) {
        counts.draws++;
        return Reflect.apply(draw, this, args);
      };
    });
    const count = () =>
      page.evaluate(
        () =>
          (window as unknown as { atomDrawCounts: { draws: number } })
            .atomDrawCounts.draws,
      );
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.getByRole("button", { name: new RegExp(open) }).click();
    await expect(page.locator("canvas")).toBeVisible({ timeout: 15000 });
    await page.locator("canvas").scrollIntoViewIfNeeded();
    await expect.poll(count).toBeGreaterThan(0);
    await page.waitForTimeout(500);
    const idle = await count();
    await page.waitForTimeout(300);
    expect(await count()).toBe(idle);
    await page.getByRole("button", { name: new RegExp(rotate) }).click();
    await expect.poll(count).toBeGreaterThan(idle);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(500);
    const paused = await count();
    await page.waitForTimeout(300);
    expect(await count()).toBe(paused);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect.poll(count).toBeGreaterThan(paused);
    if (route === "/globe") {
      const bounds = (await page.locator("canvas").boundingBox())!;
      await page.mouse.move(
        bounds.x + bounds.width / 2,
        bounds.y + bounds.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        bounds.x + bounds.width / 2 + 40,
        bounds.y + bounds.height / 2,
      );
      await page.mouse.up();
      const afterDrag = await count();
      await expect.poll(count).toBeGreaterThan(afterDrag);
    }
  });
}
