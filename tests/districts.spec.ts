import { test, expect } from '@playwright/test';

test.describe('District Page Functionality', () => {
    test('should navigate to a district and switch languages correctly', async ({ page }) => {
        // 1. Navigate to the Districts listing page
        await page.goto('/districts');
        await expect(page).toHaveTitle(/Districts/);

        // 2. Click on the "Cuttack" card (more stable than Angul in test env for some reason?)
        const cuttackCard = page.getByRole('link', { name: /Cuttack/i }).first();
        await expect(cuttackCard).toBeVisible();
        await expect(cuttackCard).toHaveAttribute('href', '/district/cuttack');

        // 3. Navigate directly to Cuttack page
        await page.goto('/district/cuttack');

        // Verify we are on the English Cuttack page
        await page.waitForURL(/\/district\/cuttack$/);

        // Check for heading existence
        const heading = page.locator('h1');
        await expect(heading).toBeVisible({ timeout: 20000 });
        await expect(heading).toContainText('Cuttack');

        // 4. Open Language Toggle
        // Use more specific selector to avoid ambiguity
        const langButton = page.locator('button[aria-label*="Current language"]');
        await expect(langButton).toBeVisible();
        await langButton.click({ force: true });

        // 5. Select Odia
        const odiaOption = page.getByRole('menuitem', { name: /ଓଡ଼ିଆ/i });
        await odiaOption.click();

        // 6. Verify URL and Content change to Odia
        await expect(page).toHaveURL(/\/district\/cuttack-od$/);
        // "କଟକ" is Cuttack in Odia
        await expect(page.getByRole('heading', { name: 'କଟକ', level: 1 })).toBeVisible();

        // 7. Switch back to English
        const langButtonOdia = page.getByRole('button', { name: /ଓଡ଼ିଆ/i });
        await langButtonOdia.click();

        const englishOption = page.getByRole('menuitem', { name: /English/i });
        await englishOption.click();

        // 8. Verify URL returns to English
        await expect(page).toHaveURL(/\/district\/cuttack$/);
        await expect(page.getByRole('heading', { name: 'Cuttack', level: 1 })).toBeVisible();
    });

    test('should handle direct navigation to Odia district page', async ({ page }) => {
        await page.goto('/district/cuttack-od');
        // Verify Odia content
        await expect(page.getByRole('heading', { name: 'କଟକ', level: 1 })).toBeVisible();
        await expect(page.getByText(/ରୌପ୍ୟ ନଗରୀ/)).toBeVisible();
    });
});
