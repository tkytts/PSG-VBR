# E2E Tests Quick Reference

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with browser visible
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Interactive UI
npm run test:e2e:ui

# View report
npm run test:e2e:report
```

## Test Files

- `tutorial.spec.js` - Tutorial workflow tests (9 tests)
- `participant.spec.js` - Participant experience tests (13 tests)
- `experimenter.spec.js` - Experimenter controls tests (15 tests)
- `realtime-chat.spec.js` - SignalR communication tests (13 tests)
- `data-integrity.spec.js` - Data collection validation tests (12 tests)

**Total: 62 E2E tests**

## Prerequisites

1. Backend running on `http://localhost:5000`
2. Frontend running on `http://localhost:3000` (or let Playwright auto-start)

## Key Test Scenarios

### Critical for Research Platform

1. **Data Integrity**: Verifies participant actions → CSV telemetry logging
2. **SignalR Communication**: Tests real-time message exchange
3. **Complete Workflows**: Tutorial → Game → Data collection

### Feature Coverage

- Tutorial onboarding flow
- Participant name entry and game interaction
- Experimenter game controls and monitoring
- Real-time chat functionality
- API endpoint validation

## Documentation

See [E2E-TESTING.md](../E2E-TESTING.md) for complete documentation.

## Custom Fixtures

```javascript
const { test, expect, helpers } = require('./fixtures');

test('example', async ({ participantPage }) => {
  // Use helper functions
  await helpers.setParticipantName(participantPage, 'Test User');
  await helpers.sendChatMessage(participantPage, 'Hello!');
});
```

## Troubleshooting

**Backend not running**:
```bash
cd backend
dotnet run --project src/GameServer.Api
```

**Frontend not running**:
```bash
cd frontend
npm start
```

**View detailed errors**:
```bash
npm run test:e2e:report
```
