import { test, expect } from '@playwright/test';

test.describe('WBS 3.4: Web UI Test Suite - Visual Regression and Data Masking', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  // TC-UI-VIS-01: Chụp và so sánh giao diện chuẩn
  test('TC-UI-VIS-01: Baseline Snapshot Generation & Page Comparison', async ({ page }) => {
    await expect(page).toHaveScreenshot('inventory-baseline.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });

  // TC-UI-VIS-02: Che các vùng dữ liệu động (Masking)
  test('TC-UI-VIS-02: Dynamic Data Masking on Variable Elements', async ({ page }) => {
    await expect(page).toHaveScreenshot('inventory-masked.png', {
      mask: [
        page.locator('.inventory_item_img'), // Che ảnh sản phẩm
        page.locator('.footer'),             // Che phần chân trang
      ],
      maxDiffPixelRatio: 0.01,
    });
  });

  // TC-UI-VIS-03: Cố tình đổi màu nút bấm để kích hoạt bộ 3 ảnh Diff (Actual, Expected, Diff)
  test('TC-UI-VIS-03: Visual Regression Mutation Failure & 3-Image Diff Generation', async ({ page }) => {
    // Đổi màu nền nút bấm đầu tiên sang màu đỏ bằng CSS injection
    await page.evaluate(() => {
      const btn = document.querySelector('.btn_inventory') as HTMLElement;
      if (btn) {
        btn.style.backgroundColor = 'rgb(255, 0, 0)';
      }
    });

    // So sánh với ảnh baseline chuẩn -> Kỳ vọng sẽ FAIL để xuất ra ảnh Diff
    await expect(page).toHaveScreenshot('inventory-baseline.png');
  });

});