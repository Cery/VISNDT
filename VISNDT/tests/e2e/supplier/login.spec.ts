/**
 * Supplier E2E journey scaffold (M26 boundary prep).
 *
 * NOTE: This file documents the Supplier login + profile journey as a future
 * Playwright spec. Playwright has NOT been installed in this task
 * (framework introduction is explicitly out of scope for 648). Installation
 * and execution are deferred to a dedicated M26 automated-testing task.
 */
import { test, expect } from '@playwright/test';

const WEB_BASE_URL = process.env.WEB_BASE_URL ?? 'http://localhost:3000';

test('supplier can log in and reach the supplier workspace', async ({ page }) => {
  await page.goto(`${WEB_BASE_URL}/login`);
  // TODO(async fixture exists): fill login form
  // - email: demo.supplier.01@visndt.local
  // - password: demo123456
  await expect(page).toHaveURL(/\/dashboard|\/workspace/);
});