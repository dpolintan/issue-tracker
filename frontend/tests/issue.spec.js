import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Create Issue
  await page.getByRole('button', { name: 'Create Issue' }).click();
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Issue #1');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Add playwright test to the codebase to test frontend functionality');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Issue #1' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Add playwright test to the' })).toBeVisible();
  await expect(page.getByText('open')).toBeVisible();

  // Edit Issue
  await page.getByRole('button', { name: 'edit' }).click();
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Issue #2');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Add playwright test to the codebase to test frontend functionality ');
  await page.getByRole('textbox', { name: 'Description' }).fill('[Edited] Add playwright test to the codebase to test frontend functionality ');
  await page.getByRole('combobox', { name: 'Status open' }).click();
  await page.getByRole('option', { name: 'closed' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('cell', { name: 'Issue #2' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '[Edited] Add playwright test' })).toBeVisible();
  await expect(page.getByText('closed')).toBeVisible();

  // Delete Issue
  await page.getByRole('button', { name: 'delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('cell', { name: 'Issue #2' })).toBeHidden();
  await expect(page.getByRole('cell', { name: '[Edited] Add playwright test' })).toBeHidden();
  await expect(page.getByText('closed')).toBeHidden();
});