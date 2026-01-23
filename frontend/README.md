# Experiment Frontend

React-based frontend for the behavioral experiment platform with real-time communication via SignalR.

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local` for local development:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_HUB_URL=http://localhost:5000/api/gamehub
```

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `/api` | Backend API base URL |
| `REACT_APP_HUB_URL` | `${REACT_APP_API_URL}/gamehub` | SignalR hub URL |

## Available Routes

| Route | Description |
|-------|-------------|
| `/tutorial` | Participant tutorial and onboarding |
| `/participant` | Participant game view |
| `/experimenter` | Admin/experimenter controls |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once (CI mode) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run build` | Create production build |

## Architecture

```
src/
??? api/           # Backend API clients (client.js, users.js)
??? data/          # Static data loaders (confederates.js)
??? components/    # Reusable UI components (Modal, ChatBox, GameBox, etc.)
??? pages/         # Route-level components (Experimenter, Participant, Tutorial)
??? realtime/      # SignalR helpers (game.js)
??? hooks/         # Custom React hooks (useFontSize.js)
??? context/       # React Context providers (ChimesConfigContext.js)
??? constants/     # Application constants (resolutionTypes.js, languages.js)
??? locales/       # Translation files (en, pt)
??? __tests__/     # App-level tests
??? __mocks__/     # Jest module mocks
??? test-utils/    # Test utilities
??? config.js      # Environment-aware configuration
??? i18n.js        # i18next initialization
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed coding standards and guidelines.

## Testing

The test suite includes 89 tests across 13 test suites covering components, hooks, context, and utilities.

```bash
npm test                # Interactive watch mode
npm run test:ci         # Single run (CI)
npm run test:coverage   # With coverage report
```

### Test Coverage

| Area | Tests |
|------|-------|
| Components | ChatBox, GameBox, Modal, FontSizeControls, LanguageSelector, InputModal, ErrorBoundary |
| Hooks | useFontSize |
| Context | ChimesConfigContext |
| Constants | config, languages, resolutionTypes |
| App | Routing, font controls |

## Internationalization

The app supports multiple languages via i18next:

- English (`en`)
- Portuguese (`pt`)

Translation files are in `src/locales/{lang}/translation.json`.

## Tech Stack

- **React 18** - UI framework
- **React Router 6** - Client-side routing
- **SignalR** - Real-time communication
- **i18next** - Internationalization
- **Bootstrap 5** - Styling
- **Jest + React Testing Library** - Testing

## Related Documentation

- [Project Overview](../README.md)
- [Backend API Documentation](../backend/README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
