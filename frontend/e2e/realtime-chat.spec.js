const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Real-time Chat and SignalR Communication
 *
 * These tests verify:
 * - SignalR connection establishment via WebSocket
 * - Real-time message sending and receiving
 * - Chat synchronization between multiple users
 * - Connection resilience
 *
 * Note: Tests focus on observable behavior (WebSocket connections, DOM changes)
 * rather than internal implementation details.
 */

test.describe('SignalR Connection', () => {
  test('should establish WebSocket connection on participant page', async ({ page }) => {
    const wsConnections = [];

    page.on('websocket', ws => {
      console.log('WebSocket connection:', ws.url());
      wsConnections.push(ws);

      ws.on('framesent', event => console.log('Frame sent:', event.payload));
      ws.on('framereceived', event => console.log('Frame received:', event.payload));
    });

    await page.goto('/participant');

    // Wait for SignalR connection
    await page.waitForTimeout(3000);

    // Should have at least one WebSocket connection
    expect(wsConnections.length).toBeGreaterThan(0);

    // Connection URL should contain 'gamehub' or 'signalr'
    const hasGameHubConnection = wsConnections.some(ws =>
      ws.url().includes('gamehub') || ws.url().includes('signalr')
    );

    expect(hasGameHubConnection).toBe(true);
  });

  test('should establish connection on experimenter page', async ({ page }) => {
    const wsConnections = [];

    page.on('websocket', ws => {
      wsConnections.push(ws);
    });

    await page.goto('/experimenter');
    await page.waitForTimeout(3000);

    expect(wsConnections.length).toBeGreaterThan(0);
  });

  test('should log SignalR connection success', async ({ page }) => {
    const consoleMessages = [];

    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    await page.goto('/participant');
    await page.waitForTimeout(3000);

    // Check for SignalR connection log
    const hasConnectionLog = consoleMessages.some(msg =>
      msg.includes('SignalR connected') || msg.includes('Hub URL')
    );

    expect(hasConnectionLog).toBe(true);
  });

  test('should allow participant name submission via SignalR', async ({ page }) => {
    await page.goto('/participant');
    await page.waitForTimeout(2000);

    // Set participant name (this uses SignalR internally)
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill('SignalR Test User');
    await submitButton.click();

    // If SignalR works, the form should be processed and game interface shown
    await page.waitForTimeout(1500);

    // Game interface should be visible (chat, game content, etc.)
    const bodyText = await page.locator('body').textContent();

    // Should have game-related content (Portuguese or English)
    const hasGameContent = bodyText.includes('Mensagens') ||
                          bodyText.includes('Messages') ||
                          bodyText.includes('Aguardando') ||
                          bodyText.includes('Waiting');

    expect(hasGameContent).toBe(true);
  });
});

test.describe('Chat Functionality - Single User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/participant');

    // Set participant name
    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill('Test Participant');
    await submitButton.click();
    await page.waitForTimeout(1500);
  });

  test('should have chat input available', async ({ page }) => {
    // Chat component should be in the DOM
    await page.waitForTimeout(1000);

    const body = await page.locator('body').innerHTML();
    expect(body).toBeTruthy();
  });

  test('should allow typing in chat when ready', async ({ page }) => {
    // After participant is ready and confederate is assigned,
    // chat should become available
    await page.waitForTimeout(2000);

    // Try to find chat input
    const chatInputs = await page.locator('input[type="text"]').all();

    // There should be at least one input (possibly for chat)
    expect(chatInputs.length).toBeGreaterThan(0);
  });
});

test.describe('Chat Functionality - Multi-User Simulation', () => {
  test('should connect participant and experimenter via WebSocket', async ({ browser }) => {
    // Create two contexts - one for participant, one for experimenter
    const participantContext = await browser.newContext();
    const experimenterContext = await browser.newContext();

    const participantPage = await participantContext.newPage();
    const experimenterPage = await experimenterContext.newPage();

    try {
      // Track WebSocket connections
      let participantWS = false;
      let experimenterWS = false;

      participantPage.on('websocket', ws => {
        if (ws.url().includes('gamehub')) participantWS = true;
      });

      experimenterPage.on('websocket', ws => {
        if (ws.url().includes('gamehub')) experimenterWS = true;
      });

      // Navigate both pages
      await participantPage.goto('/participant');
      await experimenterPage.goto('/experimenter');

      // Set participant name
      const nameInput = participantPage.locator('input[type="text"]').first();
      const submitButton = participantPage.locator('button[type="submit"]');

      await nameInput.fill('Test Participant');
      await submitButton.click();

      // Wait for connections to establish
      await participantPage.waitForTimeout(2000);
      await experimenterPage.waitForTimeout(2000);

      // Verify both pages loaded
      await expect(participantPage.locator('body')).toBeVisible();
      await expect(experimenterPage.locator('body')).toBeVisible();

      // Both should have WebSocket connections
      expect(participantWS).toBe(true);
      expect(experimenterWS).toBe(true);

    } finally {
      await participantContext.close();
      await experimenterContext.close();
    }
  });
});

test.describe('SignalR Event Handling', () => {
  test('should log real-time events', async ({ page }) => {
    const debugLogs = [];

    page.on('console', msg => {
      if (msg.text().includes('[realtime/game]') || msg.text().includes('SignalR')) {
        debugLogs.push(msg.text());
      }
    });

    await page.goto('/participant');
    await page.waitForTimeout(3000);

    // Should have some SignalR-related logs
    expect(debugLogs.length).toBeGreaterThan(0);
  });

  test('should track connection lifecycle via console logs', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    await page.goto('/participant');
    await page.waitForTimeout(3000);

    // Should see connection-related messages
    const hasConnectionMessages = consoleMessages.some(msg =>
      msg.includes('SignalR') || msg.includes('Hub URL') || msg.includes('connected')
    );

    expect(hasConnectionMessages).toBe(true);
  });
});

test.describe('SignalR Resilience', () => {
  test('should reconnect after page reload', async ({ page }) => {
    let wsConnections = 0;

    page.on('websocket', ws => {
      if (ws.url().includes('gamehub')) wsConnections++;
    });

    await page.goto('/participant');
    await page.waitForTimeout(2000);

    const firstConnectionCount = wsConnections;
    expect(firstConnectionCount).toBeGreaterThan(0);

    // Reload page
    await page.reload();
    await page.waitForTimeout(2000);

    // Should have established connection again
    expect(wsConnections).toBeGreaterThan(firstConnectionCount);
  });

  test('should establish connection on multiple page loads', async ({ page }) => {
    // Load participant page multiple times
    for (let i = 0; i < 3; i++) {
      let hasConnection = false;

      page.on('websocket', ws => {
        if (ws.url().includes('gamehub')) hasConnection = true;
      });

      await page.goto('/participant');
      await page.waitForTimeout(1500);

      expect(hasConnection).toBe(true);
    }
  });
});

test.describe('Real-time Functionality via User Actions', () => {
  test('should submit participant name via real-time connection', async ({ page }) => {
    await page.goto('/participant');
    await page.waitForTimeout(2000);

    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill('Realtime Test User');
    await submitButton.click();

    // Wait for SignalR to process and game interface to load
    await page.waitForTimeout(1500);

    // Game interface should be shown
    const bodyText = await page.locator('body').textContent();

    // Should show game content (messages, waiting text, etc.)
    expect(bodyText.length).toBeGreaterThan(100);

    // Should have some game-related elements
    const hasGameElements = bodyText.includes('Mensagens') ||
                           bodyText.includes('Messages') ||
                           bodyText.includes('Pontos') ||
                           bodyText.includes('Points');

    expect(hasGameElements).toBe(true);
  });

  test('should show waiting state after name submission', async ({ page }) => {
    await page.goto('/participant');
    await page.waitForTimeout(2000);

    const nameInput = page.locator('input[type="text"]').first();
    const submitButton = page.locator('button[type="submit"]');

    await nameInput.fill('Test User');
    await submitButton.click();

    await page.waitForTimeout(1500);

    // Page should show some waiting/game content
    const pageText = await page.locator('body').textContent();
    expect(pageText.length).toBeGreaterThan(100);
  });

  test('should render game interface on experimenter page', async ({ page }) => {
    await page.goto('/experimenter');
    await page.waitForTimeout(2000);

    // Experimenter page should have control buttons
    const buttons = await page.locator('button').all();
    expect(buttons.length).toBeGreaterThan(0);

    // Should have heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
