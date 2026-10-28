import { test, expect, type Page } from '@playwright/test';

async function resetGallery(page: Page) {
  await page.goto('');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.describe('image submission', () => {
  test('submitting the form with valid data adds a new card to the list', async ({ page }) => {
    await resetGallery(page);
    const initialCount = await page.locator('#card-list article').count();

    await page.getByPlaceholder('Image Title').fill('Playwright Test Image');
    await page.getByPlaceholder('https://img.com/erick.png').fill('https://picsum.photos/200');
    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.locator('#card-list article')).toHaveCount(initialCount + 1);
    await expect(page.getByRole('heading', { name: 'Playwright Test Image' })).toBeVisible();
  });

  test('clears the form fields after a successful submission', async ({ page }) => {
    await resetGallery(page);

    await page.getByPlaceholder('Image Title').fill('Another Image');
    await page.getByPlaceholder('https://img.com/erick.png').fill('https://picsum.photos/201');
    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.getByPlaceholder('Image Title')).toHaveValue('');
    await expect(page.getByPlaceholder('https://img.com/erick.png')).toHaveValue('');
  });
});

test.describe('form validation', () => {
  test('shows validation errors and does not add a card when the form is empty', async ({ page }) => {
    await resetGallery(page);
    const initialCount = await page.locator('#card-list article').count();

    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.getByText('Please type a title for the image.')).toBeVisible();
    await expect(page.getByText('Please type a valid URL')).toBeVisible();
    await expect(page.locator('#card-list article')).toHaveCount(initialCount);
  });

  test('shows a validation error and does not add a card for an invalid image URL', async ({ page }) => {
    await resetGallery(page);
    const initialCount = await page.locator('#card-list article').count();

    await page.getByPlaceholder('Image Title').fill('Valid Title');
    await page.getByPlaceholder('https://img.com/erick.png').fill('not-a-url');
    await page.getByRole('button', { name: 'Submit Form' }).click();

    await expect(page.getByText('Please type a valid URL')).toBeVisible();
    await expect(page.locator('#card-list article')).toHaveCount(initialCount);
  });
});
