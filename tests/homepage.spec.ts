import { test, expect } from '@playwright/test';

test('homepage has correct title and vibrance', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Odiapedia/);

    // Check for specialized font class on heading
    const heading = page.locator('h1');
    await expect(heading).toHaveClass(/font-display/);
    await expect(heading).toContainText('Odiapedia');

    // Check for the "Coastal Vibrance" styling
    const heroSection = page.locator('section').first();
    await expect(heroSection).toHaveClass(/bg-slate-50/);

    // Check Language Toggle exists
    await expect(page.getByRole('button', { name: /English/i })).toBeVisible();
});
