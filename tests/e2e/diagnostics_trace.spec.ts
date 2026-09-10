import { test, expect } from '@playwright/test';

test.describe('WBS 3.3: Web UI Test Suite - Post-Mortem Diagnostics with Trace Viewer', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('TC-UI-TRACE-01: Performance Glitch Latency Triage & Trace Generation', async ({ page }) => {
    await page.locator('#user-name').fill('performance_glitch_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });

  test('TC-UI-TRACE-02: Intentional Assertion Failure for Post-Mortem Diagnostics', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    // Cố tình fail để sinh file trace phục vụ chẩn đoán hậu kỳ
    await expect(page.locator('.title')).toHaveText('Wrong Title', { timeout: 3000 });
  });

  test('TC-UI-TRACE-03: Network Waterfall & Slow Request Identification', async ({ page }) => {
    await page.locator('#user-name').fill('performance_glitch_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const inventoryContainer = page.locator('#inventory_container').first();
    await expect(inventoryContainer).toBeVisible();

    const inventoryItems = page.locator('.inventory_item');
    await expect(inventoryItems).toHaveCount(6);
  });

});