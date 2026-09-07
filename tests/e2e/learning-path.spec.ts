import { test, expect } from "@playwright/test";

test.describe("R11 Learning Path: Seven-Lesson Educational Experience", () => {
  test("loads /learn catalog and navigates to first lesson", async ({
    page,
  }) => {
    await page.goto("/learn");

    await expect(
      page.getByRole("heading", {
        name: /Nuclear Energy Curriculum/i,
        level: 1,
      }),
    ).toBeVisible();

    const energyCard = page.getByTestId("lesson-card-energy");
    await expect(energyCard).toBeVisible();
    await expect(energyCard).toContainText("Energy & Power");
    await expect(energyCard).toContainText("Distinguish power from energy");

    // Click on the first lesson
    await energyCard.click();
    await expect(page).toHaveURL(/\/learn\/energy/);
    await expect(
      page.getByRole("heading", { name: /Energy & Power/i, level: 1 }),
    ).toBeVisible();
  });

  test("renders /learn/energy with 5-level explanation switcher and interaction", async ({
    page,
  }) => {
    await page.goto("/learn/energy");

    // Check breadcrumb
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Learn" })).toBeVisible();

    // Check objective
    await expect(
      page.getByText(
        /Distinguish power from energy and understand energy density/i,
      ),
    ).toBeVisible();

    // Check default level (Curious)
    const explanation = page.getByTestId("lesson-explanation");
    await expect(explanation).toContainText(
      "Chemical fuels store energy in electron bonds",
    );

    // Switch to Kid (Level 1)
    const article = page.getByRole("article", { name: "Energy & Power" });
    await article.getByRole("button", { name: "Kid" }).click();
    await expect(explanation).toContainText("Energy is the ability to do work");

    // Switch to Technical (Level 4)
    await article.getByRole("button", { name: "Technical" }).click();
    await expect(explanation).toContainText(
      "Specific energy density governs fuel cycle logistics",
    );

    // Interactive slider check
    const interaction = page.getByTestId("energy-interaction");
    await expect(interaction).toBeVisible();
    const slider = page.locator("#pellet-slider");
    await expect(slider).toBeVisible();
    await slider.fill("3");
    await expect(page.getByText("3 ton")).toBeVisible();
  });

  test("formative checkpoint: wrong answer shows feedback, correct answer records completion", async ({
    page,
  }) => {
    await page.goto("/learn/energy");

    const checkpoint = page.getByTestId("lesson-checkpoint");
    await expect(checkpoint).toBeVisible();

    // Check submit disabled initially
    const submitBtn = page.getByTestId("checkpoint-submit");
    await expect(submitBtn).toBeDisabled();

    // Select incorrect option
    const wrongOption = page.getByLabel(
      /Nuclear fuel burns at a much higher temperature than coal or natural gas/i,
    );
    await wrongOption.check();
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Assert feedback
    const feedback = page.getByTestId("checkpoint-feedback");
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText("Not quite.");
    await expect(feedback).toContainText(
      "Operating temperatures of nuclear steam cycles",
    );

    // Retry flow
    const retryBtn = page.getByTestId("checkpoint-retry");
    await retryBtn.click();
    await expect(feedback).not.toBeVisible();

    // Select correct option
    const correctOption = page.getByLabel(
      /Nuclear reactions release energy from the strong nuclear force/i,
    );
    await correctOption.check();
    await submitBtn.click();

    // Assert success feedback & completion badge
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText("Correct!");
    await expect(feedback).toContainText(
      "Nuclear binding energy yields roughly 200 MeV",
    );
    await expect(page.getByTestId("completed-badge")).toBeVisible();

    // Navigate to next lesson
    const nextBtn = page.getByTestId("next-lesson");
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await expect(page).toHaveURL(/\/learn\/atom/);
    await expect(
      page.getByRole("heading", { name: /Inside the Atom/i, level: 1 }),
    ).toBeVisible();
  });

  test("recovers gracefully from corrupt localStorage progress", async ({
    page,
  }) => {
    await page.goto("/learn/energy");
    await page.evaluate(() => {
      window.localStorage.setItem(
        "atom:learning-progress:v1",
        "INVALID_JSON_CORRUPT{",
      );
    });
    await page.reload();
    await expect(
      page.getByRole("heading", { name: /Energy & Power/i, level: 1 }),
    ).toBeVisible();
  });

  test("returns 404 for unknown or draft lesson slug", async ({ page }) => {
    const response = await page.goto("/learn/non-existent-lesson-slug");
    expect(response?.status()).toBe(404);
  });
});
