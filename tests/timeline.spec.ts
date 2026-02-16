import { test, expect } from '@playwright/test';

test('timeline page loads with events', async ({ page }) => {
    await page.goto('/history/timeline');

    // Check title
    await expect(page.locator('h1')).toContainText('Timeline of Odisha');

    // Check for at least one event card
    // Using a locator that matches the card structure we just refactored
    // .group.relative.bg-white.border.border-slate-100
    const cards = page.locator('.group.relative.bg-white');

    // We expect more than 5 cards to load
    const count = await cards.count();
    expect(count).toBeGreaterThan(5);

    // Check specifically for "Kalinga War"
    await expect(page.getByText('Kalinga War')).toBeVisible();

    // Check for era headers
    await expect(page.getByText('Prehistoric Era')).toBeVisible();
    await expect(page.getByText('Ancient Era')).toBeVisible();
});
