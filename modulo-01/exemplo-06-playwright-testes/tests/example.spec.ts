import { test, expect } from '@playwright/test';

test('has correct title', async ({ page }) => {
  await page.goto('');

  await expect(page).toHaveTitle('TDD Frontend Example');
});

test('shows the image gallery form and captions', async ({ page }) => {
  await page.goto('');

  await expect(page.getByPlaceholder('Image Title')).toBeVisible();
  await expect(page.getByPlaceholder('https://img.com/erick.png')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'AI Alien' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Predator Night Vision' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'ET Bilu' })).toBeVisible();
});
