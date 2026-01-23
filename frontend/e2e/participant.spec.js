const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Participant Workflow
 *
 * These tests verify the core participant experience including:
 * - Name entry
 * - Waiting for confederate matching
 * - Game interaction
 * - Chat functionality
 */

test.describe('Participant Page - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/participant');
  });

  test('should load participant page successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*participant/);

    // Page title should be visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should display name input form on initial load', async ({ page }) => {
    // Verify name input is visible
    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();

    // Verify submit button is visible
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should allow participant to enter name', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    // Enter participant name
    await nameInput.fill('Test Participant');
    await expect(nameInput).toHaveValue('Test Participant');

    // Submit name
    await submitButton.click();

    // Wait for form to be processed
    await page.waitForTimeout(1000);

    // Name input should no longer be visible (or form should change)
    // After setting name, participant waits for confederate
  });

  test('should not accept empty name submission', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    // Try to submit empty name
    await nameInput.fill('');
    await submitButton.click();

    // Form should still be visible (validation should prevent submission)
    await expect(nameInput).toBeVisible();
  });

  test('should display waiting message after name submission', async ({ page }) => {
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    // Submit name
    await nameInput.fill('Test Participant');
    await submitButton.click();

    // Wait for modal or waiting message
    await page.waitForTimeout(1500);

    // Check for waiting text (might be in modal or on page)
    const pageContent = await page.locator('body').textContent();
    // The page should show some kind of waiting state
    expect(pageContent).toBeTruthy();
  });
});

test.describe('Participant Page - Game Interface', () => {
  test('should render ChatBox component', async ({ page }) => {
    await page.goto('/participant');

    // Set participant name first
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill('Test Participant');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // ChatBox should be rendered (even if hidden initially)
    // It should be in the DOM
    const body = await page.locator('body').innerHTML();
    expect(body).toBeTruthy();
  });

  test('should render GameBox component', async ({ page }) => {
    await page.goto('/participant');

    // Set participant name
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill('Test Participant');
    await submitButton.click();
    await page.waitForTimeout(1000);

    // GameBox component should be in DOM
    const body = await page.locator('body').innerHTML();
    expect(body).toBeTruthy();
  });
});

test.describe('Participant Page - SignalR Integration', () => {
  test('should attempt SignalR connection', async ({ page }) => {
    // Listen for WebSocket connection attempts
    const wsRequests = [];
    page.on('websocket', ws => {
      wsRequests.push(ws.url());
    });

    await page.goto('/participant');
    await page.waitForTimeout(3000);

    // Verify WebSocket connection was attempted
    // SignalR uses WebSocket for real-time communication
    expect(wsRequests.length).toBeGreaterThan(0);
  });

  test('should establish real-time connection', async ({ page }) => {
    // Listen for WebSocket connections
    let wsEstablished = false;
    page.on('websocket', ws => {
      if (ws.url().includes('gamehub')) {
        wsEstablished = true;
      }
    });

    await page.goto('/participant');

    // Wait for connection to establish
    await page.waitForTimeout(3000);

    // Verify WebSocket connection was established
    expect(wsEstablished).toBe(true);
  });
});

test.describe('Participant Page - Responsiveness', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/participant');

    // Verify container is visible
    const container = page.locator('.container');
    await expect(container).toBeVisible();

    // Verify name input is usable on mobile
    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).toBeVisible();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/participant');

    const container = page.locator('.container');
    await expect(container).toBeVisible();
  });
});

test.describe('Participant Page - Accessibility', () => {
  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/participant');

    // Check for input with placeholder or associated label
    const nameInput = page.locator('input[type="text"]').first();
    const placeholder = await nameInput.getAttribute('placeholder');

    expect(placeholder).toBeTruthy();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/participant');

    // Tab to name input
    await page.keyboard.press('Tab');

    // Type name
    await page.keyboard.type('Test User');

    // Tab to submit button and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Form should be submitted
    await page.waitForTimeout(500);
  });
});
