import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("http://localhost:5173");

  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill("ladislav.kroupa99@gmail.com");

  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill("123");

  await expect(emailInput).toHaveValue("ladislav.kroupa99@gmail.com");
  await expect(passwordInput).toHaveValue("123");

  const submitButton = page.locator('button[name="submitButton"]');
  await expect(submitButton).toBeEnabled();

  await submitButton.click();

  await expect(page).toHaveURL(/.*profile/);
  // Click the get started link.
  //await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  /*await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
 */
});
