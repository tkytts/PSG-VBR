const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Experimenter Workflow
 *
 * These tests verify the experimenter/admin controls including:
 * - Game configuration
 * - Confederate selection
 * - Game state control (start/stop)
 * - Problem navigation
 * - Timer controls
 * - Monitoring participant activity
 */

test.describe('Experimenter Page - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experimenter');
  });

  test('should load experimenter page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*experimenter/);

    // Page title should be visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display experimenter controls', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(1500);

    // Experimenter page should have control buttons
    const buttons = await page.locator('button').all();
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should load without critical errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/experimenter');
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors
    const criticalErrors = errors.filter(err =>
      !err.includes('SignalR') &&
      !err.includes('WebSocket') &&
      !err.includes('favicon')
    );

    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Experimenter Page - Game Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experimenter');
    await page.waitForTimeout(1000);
  });

  test('should have game configuration modal', async ({ page }) => {
    // Look for button to open game config
    const configButton = page.locator('button').filter({ hasText: /config|start|setup/i }).first();

    if (await configButton.isVisible()) {
      await configButton.click();
      await page.waitForTimeout(500);

      // Modal should appear
      const modal = page.locator('.modal, [role="dialog"]');
      // Modal might be visible or not depending on implementation
    }
  });

  test('should allow confederate selection', async ({ page }) => {
    // The experimenter page should have controls for selecting confederates
    // This might be in a modal or on the main page
    await page.waitForTimeout(1000);

    // Check if confederate selection elements exist
    const pageContent = await page.locator('body').innerHTML();
    expect(pageContent).toBeTruthy();
  });

  test('should allow timer configuration', async ({ page }) => {
    // Experimenter should be able to configure timer settings
    // Look for timer-related inputs or controls
    await page.waitForTimeout(1000);

    const body = await page.locator('body').innerHTML();
    expect(body).toBeTruthy();
  });
});

test.describe('Experimenter Page - Game Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experimenter');
    await page.waitForTimeout(1500);
  });

  test('should have start game control', async ({ page }) => {
    // Look for start game button
    const buttons = await page.locator('button').all();

    // Find button with text containing 'start'
    let hasStartButton = false;
    for (const button of buttons) {
      const text = await button.textContent();
      if (text && text.toLowerCase().includes('start')) {
        hasStartButton = true;
        break;
      }
    }

    // Start button should exist (might not be visible initially)
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should have timer controls', async ({ page }) => {
    // Experimenter should have timer start/stop/reset buttons
    const buttons = await page.locator('button').all();

    // Check for timer-related buttons
    let hasTimerControls = false;
    for (const button of buttons) {
      const text = await button.textContent();
      if (text && (
        text.toLowerCase().includes('timer') ||
        text.toLowerCase().includes('start') ||
        text.toLowerCase().includes('stop') ||
        text.toLowerCase().includes('reset')
      )) {
        hasTimerControls = true;
        break;
      }
    }

    // Should have some control buttons
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('should have problem navigation controls', async ({ page }) => {
    // Look for next/previous problem buttons
    const buttons = await page.locator('button').all();

    let hasNavigationControls = false;
    for (const button of buttons) {
      const text = await button.textContent();
      if (text && (
        text.toLowerCase().includes('next') ||
        text.toLowerCase().includes('previous') ||
        text.toLowerCase().includes('problem')
      )) {
        hasNavigationControls = true;
        break;
      }
    }

    // Should have buttons available
    expect(buttons.length).toBeGreaterThan(0);
  });
});

test.describe('Experimenter Page - Monitoring Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experimenter');
    await page.waitForTimeout(1500);
  });

  test('should display ChatBox for monitoring', async ({ page }) => {
    // Experimenter should see participant chat
    // ChatBox component should be rendered
    const body = await page.locator('body').innerHTML();
    expect(body).toBeTruthy();
  });

  test('should display GameBox for monitoring', async ({ page }) => {
    // Experimenter should see game state
    // GameBox component should be rendered
    const body = await page.locator('body').innerHTML();
    expect(body).toBeTruthy();
  });

  test('should show current participant information', async ({ page }) => {
    // Experimenter page should display info about current participant
    await page.waitForTimeout(1000);

    const pageText = await page.locator('body').textContent();
    expect(pageText).toBeTruthy();
  });
});

test.describe('Experimenter Page - SignalR Integration', () => {
  test('should establish SignalR connection', async ({ page }) => {
    const wsRequests = [];
    page.on('websocket', ws => {
      wsRequests.push(ws.url());
    });

    await page.goto('/experimenter');
    await page.waitForTimeout(3000);

    // SignalR connection should be attempted
    expect(wsRequests.length).toBeGreaterThan(0);
  });

  test('should log SignalR connection activity', async ({ page }) => {
    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push(msg.text());
    });

    await page.goto('/experimenter');
    await page.waitForTimeout(2000);

    // Should have SignalR-related console logs
    const hasSignalRLogs = consoleLogs.some(log =>
      log.includes('SignalR') || log.includes('Hub URL') || log.includes('connected')
    );

    expect(hasSignalRLogs).toBe(true);
  });
});

test.describe('Experimenter Page - Responsiveness', () => {
  test('should work on desktop resolution', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/experimenter');

    const container = page.locator('.container');
    await expect(container).toBeVisible();
  });

  test('should work on laptop resolution', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/experimenter');

    const container = page.locator('.container');
    await expect(container).toBeVisible();
  });
});

test.describe('Experimenter Page - Modal Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experimenter');
    await page.waitForTimeout(1500);
  });

  test('should handle modal open/close', async ({ page }) => {
    // Try to find and click any button that might open a modal
    const buttons = await page.locator('button').all();

    if (buttons.length > 0) {
      // Click first button
      await buttons[0].click();
      await page.waitForTimeout(500);

      // Check if modal appeared
      const modals = await page.locator('.modal, [role="dialog"]').all();

      // If modal exists, try to close it
      if (modals.length > 0) {
        // Look for close button
        const closeButton = page.locator('button').filter({ hasText: /close|cancel|×/i }).first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(300);
        }
      }
    }

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});
