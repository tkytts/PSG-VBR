# E2E Testing Guide

## Overview

This behavioral research platform uses **Playwright** for end-to-end (E2E) testing to verify complete workflows from the user interface through to backend data collection.

E2E tests are critical for a research platform because they validate that:
- Participant interactions are correctly captured
- Real-time SignalR communication works reliably
- Experiment data flows properly to CSV telemetry logs
- Tutorial and game workflows function end-to-end

## Setup

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Backend running** on `http://localhost:5000`
3. **Frontend running** on `http://localhost:3000`

### Installation

Playwright and browsers are already installed. If you need to reinstall:

```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

## Running E2E Tests

### Quick Start

```bash
# Run all E2E tests (headless mode)
npm run test:e2e

# Run with browser UI visible
npm run test:e2e:headed

# Run in debug mode (step through tests)
npm run test:e2e:debug

# Run in interactive UI mode
npm run test:e2e:ui

# View last test report
npm run test:e2e:report
```

### Running Specific Tests

```bash
# Run only tutorial tests
npx playwright test tutorial

# Run only participant tests
npx playwright test participant

# Run only experimenter tests
npx playwright test experimenter

# Run only real-time chat tests
npx playwright test realtime-chat

# Run only data integrity tests
npx playwright test data-integrity
```

## Test Structure

### Test Files

```
frontend/
├── e2e/
│   ├── fixtures.js              # Custom test fixtures and helpers
│   ├── tutorial.spec.js         # Tutorial workflow tests
│   ├── participant.spec.js      # Participant experience tests
│   ├── experimenter.spec.js     # Experimenter controls tests
│   ├── realtime-chat.spec.js    # SignalR communication tests
│   └── data-integrity.spec.js   # Telemetry logging tests
└── playwright.config.js         # Playwright configuration
```

### Test Coverage

| Test Suite | Description | Test Count |
|------------|-------------|------------|
| **tutorial.spec.js** | Tutorial onboarding flow, step progression, UI responsiveness | 9 tests |
| **participant.spec.js** | Name entry, waiting for confederate, game interface, SignalR connection, accessibility | 13 tests |
| **experimenter.spec.js** | Game configuration, controls, monitoring interface, modals | 15 tests |
| **realtime-chat.spec.js** | SignalR connection, chat functionality, event handling, resilience | 13 tests |
| **data-integrity.spec.js** | Telemetry logging, data capture, API consistency, complete workflows | 12 tests |

**Total: 62 E2E tests**

## Test Scenarios

### 1. Tutorial Workflow Tests

Tests the tutorial onboarding experience:
- Page loads successfully
- Tutorial instructions display
- Users can progress through steps
- Tutorial completion
- Mobile responsiveness

### 2. Participant Workflow Tests

Tests the core participant experience:
- Name input and validation
- Waiting for confederate assignment
- Game interface rendering (ChatBox, GameBox)
- SignalR connection establishment
- Keyboard navigation and accessibility

### 3. Experimenter Workflow Tests

Tests experimenter admin controls:
- Page loads and displays controls
- Game configuration modal
- Confederate selection
- Timer controls (start/stop/reset)
- Problem navigation (next/previous)
- Monitoring interface (chat and game state)

### 4. Real-time Chat & SignalR Tests

Tests real-time communication:
- WebSocket connection establishment
- SignalR connection state
- Chat message sending/receiving
- Multi-user message exchange
- Event handler setup
- Connection resilience (reconnection)

### 5. Data Integrity Tests

Critical tests for research data collection:
- Telemetry logging configuration
- Participant actions → CSV logging
- Chat message persistence
- Game state change logging
- Timer events logging
- Problem navigation logging
- Resolution and scoring logging
- Complete workflow data capture
- API data consistency

## Configuration

### Playwright Config ([playwright.config.js](playwright.config.js))

Key settings:
- **Test directory**: `./e2e`
- **Timeout**: 60 seconds per test
- **Workers**: 1 (sequential execution to avoid state conflicts)
- **Base URL**: `http://localhost:3000`
- **Screenshots**: On failure
- **Videos**: On failure
- **Trace**: On first retry

### Environment Requirements

E2E tests require both frontend and backend to be running:

1. **Backend**: `http://localhost:5000`
   ```bash
   cd backend
   dotnet run --project src/GameServer.Api
   ```

2. **Frontend**: `http://localhost:3000`
   ```bash
   cd frontend
   npm start
   ```

   Or let Playwright start it automatically (configured in `webServer` section).

## Writing New Tests

### Using Custom Fixtures

```javascript
const { test, expect, helpers } = require('./fixtures');

test('my test', async ({ participantPage }) => {
  // participantPage is already on /participant with SignalR connected
  await helpers.setParticipantName(participantPage, 'Test User');
  await helpers.sendChatMessage(participantPage, 'Hello!');
});
```

### Available Fixtures

- `participantPage`: Navigates to `/participant` with SignalR connection
- `experimenterPage`: Navigates to `/experimenter` with SignalR connection
- `tutorialPage`: Navigates to `/tutorial`

### Helper Functions

```javascript
// Set participant name
await helpers.setParticipantName(page, 'John Doe');

// Send chat message
await helpers.sendChatMessage(page, 'Hello!');

// Wait for message to appear
await helpers.waitForChatMessage(page, 'Hello!');

// Start timer
await helpers.startTimer(page);

// Navigate to next problem
await helpers.nextProblem(page);

// Check SignalR connection
const isConnected = await helpers.isSignalRConnected(page);
```

## Debugging Tests

### Visual Debugging

```bash
# Run with headed browser
npm run test:e2e:headed

# Run with Playwright Inspector
npm run test:e2e:debug

# Run with UI mode (best for debugging)
npm run test:e2e:ui
```

### Viewing Test Reports

After test runs, view detailed reports:

```bash
npm run test:e2e:report
```

Reports include:
- Test results (pass/fail)
- Screenshots of failures
- Video recordings of failures
- Traces for debugging

### Console Logging

Tests include console logging for debugging:
- WebSocket connections
- SignalR frames sent/received
- Participant names used
- Test completion messages

## Best Practices

### 1. Always Wait for SignalR Connection

```javascript
await page.waitForFunction(() => {
  return window.connection && window.connection.state === 'Connected';
}, { timeout: 10000 });
```

### 2. Use Appropriate Timeouts

```javascript
// Short timeout for fast operations
await page.waitForTimeout(500);

// Longer timeout for SignalR operations
await page.waitForTimeout(2000);
```

### 3. Clean Up Browser Contexts

```javascript
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  // ... test code ...
} finally {
  await context.close();
}
```

### 4. Test Real-World Scenarios

Focus on complete workflows that researchers will use:
- Tutorial → Game → Data Collection
- Participant joins → Completes game → Data logged
- Experimenter controls → Problem navigation → Resolution

### 5. Verify Data Integrity

Always test that participant actions result in:
- SignalR messages sent
- Backend state updates
- CSV telemetry logging

## Troubleshooting

### Tests Fail: Backend Not Running

**Error**: `Backend not accessible. Ensure backend is running on http://localhost:5000`

**Solution**:
```bash
cd backend
dotnet run --project src/GameServer.Api
```

### Tests Fail: Frontend Not Running

**Error**: `page.goto: net::ERR_CONNECTION_REFUSED`

**Solution**:
```bash
cd frontend
npm start
```

Or let Playwright auto-start it (already configured).

### SignalR Connection Timeouts

**Issue**: Tests timeout waiting for SignalR connection

**Solutions**:
1. Increase timeout in test
2. Check backend SignalR hub is running
3. Verify CORS settings in `appsettings.json`
4. Check browser console for WebSocket errors

### Port Conflicts

**Issue**: Frontend or backend port already in use

**Solutions**:
1. Stop other instances: `taskkill /F /IM node.exe` (Windows) or `killall node` (Mac/Linux)
2. Change ports in configuration files
3. Update Playwright config to match new ports

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0'

      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && dotnet restore

      - name: Install Playwright Browsers
        run: cd frontend && npx playwright install --with-deps

      - name: Start Backend
        run: cd backend && dotnet run --project src/GameServer.Api &

      - name: Run E2E Tests
        run: cd frontend && npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: frontend/playwright-report/
```

## Test Maintenance

### When to Update Tests

Update E2E tests when:
1. **New Features Added**: Add corresponding E2E tests
2. **UI Changes**: Update selectors and assertions
3. **SignalR Methods Added**: Test new real-time methods
4. **Data Collection Changes**: Update data integrity tests
5. **Backend API Changes**: Update API verification tests

### Keeping Tests Reliable

1. Use data attributes for selectors: `[data-testid="participant-name-input"]`
2. Avoid brittle CSS selectors
3. Use waitForFunction for dynamic content
4. Test real user flows, not implementation details
5. Keep tests independent (no shared state)

## Performance Considerations

### Test Execution Time

- Full suite: ~5-10 minutes (depending on hardware)
- Individual test: 10-60 seconds
- Parallelization: Disabled (sequential for state management)

### Optimization Tips

1. Use headless mode for faster execution
2. Run specific test files during development
3. Use `test.only()` to focus on failing tests
4. Reduce wait timeouts in stable tests
5. Skip browser downloads in CI (use cached browsers)

## Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [Project README](../README.md)
- [Backend Testing](../backend/README.md#testing)
- [Frontend Testing](./README.md#testing)

## Support

For issues with E2E tests:
1. Check test output and error messages
2. View Playwright report: `npm run test:e2e:report`
3. Run in debug mode: `npm run test:e2e:debug`
4. Review test file for specific scenario
5. Check backend logs for SignalR errors
