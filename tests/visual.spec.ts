import { test, expect } from '@playwright/test';

test('homepage visual snapshot', async ({ page }) => {
    await page.goto('/');
    // Take a snapshot of the entire page
    await expect(page).toHaveScreenshot('homepage-full.png', {
        fullPage: true,
        maxDiffPixelRatio: 0.05,
        timeout: 10000,
        animations: 'disabled',
    });
});

test('timeline visual snapshot', async ({ page }) => {
    await page.goto('/history/timeline');
    // Take a snapshot of the visible viewport
    await expect(page).toHaveScreenshot('timeline-viewport.png');
});
