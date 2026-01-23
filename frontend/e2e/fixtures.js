const { test as base, expect } = require('@playwright/test');

/**
 * Custom fixtures for behavioral research platform E2E tests
 *
 * These fixtures provide common utilities and setup for testing
 * the research platform's participant and experimenter workflows.
 *
 * Note: Fixtures wait for WebSocket connections rather than checking
 * window objects, as the app uses ES6 modules, not global state.
 */

// Extend base test with custom fixtures
const test = base.extend({
  /**
   * Navigate to participant page and wait for SignalR connection
   */
  participantPage: async ({ page }, use) => {
    // Track WebSocket connection
    let wsConnected = false;
    page.on('websocket', ws => {
      if (ws.url().includes('gamehub')) {
        wsConnected = true;
      }
    });

    await page.goto('/participant');

    // Wait for WebSocket connection to establish
    await page.waitForTimeout(2000);

    // Log connection status
    if (!wsConnected) {
      console.log('Warning: WebSocket connection not detected for participant page');
    }

    await use(page);
  },

  /**
   * Navigate to experimenter page and wait for SignalR connection
   */
  experimenterPage: async ({ page }, use) => {
    // Track WebSocket connection
    let wsConnected = false;
    page.on('websocket', ws => {
      if (ws.url().includes('gamehub')) {
        wsConnected = true;
      }
    });

    await page.goto('/experimenter');

    // Wait for WebSocket connection
    await page.waitForTimeout(2000);

    if (!wsConnected) {
      console.log('Warning: WebSocket connection not detected for experimenter page');
    }

    await use(page);
  },

  /**
   * Navigate to tutorial page
   */
  tutorialPage: async ({ page }, use) => {
    await page.goto('/tutorial');
    await page.waitForTimeout(1000);
    await use(page);
  },
});

/**
 * Helper functions for common test operations
 */
const helpers = {
  /**
   * Set participant name via UI
   */
  async setParticipantName(page, name) {
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill(name);
    await submitButton.click();

    // Wait for SignalR to process
    await page.waitForTimeout(500);
  },

  /**
   * Send a chat message via UI
   */
  async sendChatMessage(page, message) {
    const chatInput = page.locator('input[type="text"]').first();
    await chatInput.fill(message);
    await chatInput.press('Enter');

    // Wait for message to be sent
    await page.waitForTimeout(300);
  },

  /**
   * Wait for a chat message to appear
   */
  async waitForChatMessage(page, messageText) {
    await expect(page.locator('.chat-message', { hasText: messageText })).toBeVisible({ timeout: 5000 });
  },

  /**
   * Start the timer via experimenter controls
   */
  async startTimer(page) {
    const startButton = page.locator('button', { hasText: /start.*timer/i });
    await startButton.click();
    await page.waitForTimeout(300);
  },

  /**
   * Navigate to next problem via experimenter controls
   */
  async nextProblem(page) {
    const nextButton = page.locator('button', { hasText: /next.*problem/i });
    await nextButton.click();
    await page.waitForTimeout(500);
  },

  /**
   * Check if SignalR is connected via console logs
   */
  async isSignalRConnected(page) {
    // Check for SignalR connection via console logs
    const logs = [];
    page.on('console', msg => logs.push(msg.text()));

    await page.waitForTimeout(1000);

    return logs.some(log =>
      log.includes('SignalR connected') ||
      log.includes('Hub URL')
    );
  },

  /**
   * Wait for WebSocket connection to establish
   */
  async waitForWebSocket(page) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 5000);

      page.on('websocket', ws => {
        if (ws.url().includes('gamehub')) {
          clearTimeout(timeout);
          resolve(true);
        }
      });
    });
  },
};

module.exports = { test, expect, helpers };
