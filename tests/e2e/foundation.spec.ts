import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("foundation is readable and exposes a healthy service", async ({
  page,
  request,
}) => {
  const consoleErrors: string[] = [];
  const failedResponses: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failedResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "ATOM" }),
  ).toBeVisible();
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  expect(failedResponses).toEqual([]);
  expect(consoleErrors).toEqual([]);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);

  const health = await request.get("/health");
  expect(health.ok()).toBe(true);
  await expect(health.json()).resolves.toEqual({
    service: "atom",
    status: "ok",
    version: 1,
  });
});

test("foundation keeps its declared light palette under a dark OS preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const declaredScheme = await page.evaluate(
    () => getComputedStyle(document.documentElement).colorScheme,
  );
  expect(declaredScheme).toBe("light");

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
