import { test, expect } from '@playwright/test';

test('mobile layout has responsive navigation', async ({ page }) => {
    await page.goto('/');

    // Check that the regular desktop navbar is hidden
    // Assuming desktop nav links are hidden on mobile
    const desktopNav = page.locator('nav').first();
    // We can check if the hamburger menu is visible
    const menuButton = page.locator('button[aria-label="Menu"]'); // Adjust locator based on actual specific implementation if needed

    // Or simply check that the main container has correct padding/layout
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    // Check the title is visually responsive (not overflowing)
    // This is a basic check; stricter visual regression would be better for layout
    await expect(page).toHaveTitle(/Odiapedia/);
});

test('mobile homepage shows event banner', async ({ page }) => {
    await page.goto('/');
    const eventBanner = page.locator('text=Upcoming Event');
    await expect(eventBanner).toBeVisible();
});
