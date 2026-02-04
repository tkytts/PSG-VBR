# Contributing Guidelines

Thank you for contributing to the Experiment Platform!

## Getting Started

1. Clone the repository
2. Set up both frontend and backend (see [README.md](./README.md))
3. Create a feature branch from `main`

## Project Structure

```
├── frontend/          # React application
├── backend/           # .NET 8 API with SignalR
├── README.md          # Project overview
└── CONTRIBUTING.md    # This file
```

## Development Workflow

### Running Locally

```bash
# Backend
cd backend
dotnet run --project src/GameServer.Api

# Frontend (in another terminal)
cd frontend
npm install
npm start
```

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
dotnet test
```

---

## Frontend Guidelines

### Architecture Principles

- Separate concerns: UI, state, side-effects (API), styles, and utilities
- Keep route-level pages under `src/pages`, shared UI in `src/components`
- Backend API calls belong in `src/api`, not in components
- Static data loaders belong in `src/data`
- Realtime/SignalR code under `src/realtime`
- Configuration centralized in `src/config.js`

### Folder Structure

```
frontend/src/
├── api/               # Backend API clients
│   ├── __tests__/     # API client tests
│   ├── client.js      # Base HTTP client
│   └── users.js       # User API endpoints
├── data/              # Static data loaders (public folder assets)
│   ├── __tests__/     # Data loader tests
│   └── confederates.js
├── components/        # Reusable UI components
│   └── __tests__/     # Component tests
├── pages/             # Route-level components
│   └── __tests__/     # Page tests
├── realtime/          # SignalR helpers
│   └── __tests__/     # Realtime tests
├── hooks/             # Custom React hooks
│   └── __tests__/     # Hook tests
├── context/           # React Context providers
│   └── __tests__/     # Context tests
├── constants/         # Application constants
│   └── __tests__/     # Constants tests
├── locales/           # Translation files (en, pt)
├── styles/            # CSS and theme files
├── __tests__/         # App-level tests
├── __mocks__/         # Jest mocks
├── test-utils/        # Test utilities
├── config.js          # Environment configuration
├── connection.js      # SignalR connection singleton
└── i18n.js            # i18next initialization
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `GameBox.js` |
| Hooks | camelCase with `use` prefix | `useFontSize.js` |
| Utilities | camelCase | `formatTime.js` |
| Constants | UPPER_SNAKE_CASE | `RESOLUTION_TYPES` |
| Test files | `*.test.js` in `__tests__/` | `ChatBox.test.js` |

### Coding Standards

- 2-space indentation, LF line endings
- User-facing strings go through i18n (`useTranslation` hook)
- Semantic HTML and ARIA attributes where needed
- Functional components with hooks

### Testing

```bash
npm test              # Watch mode
npm run test:ci       # Single run
npm run test:coverage # With coverage
```

- Use React Testing Library
- Mock SignalR via `src/__mocks__/realtime/game.js`
- Test user-visible behavior, not implementation details

---

## Backend Guidelines

### Architecture

The backend follows **Clean Architecture** principles:

```
backend/src/
├── GameServer.Api/            # Controllers, SignalR hub
├── GameServer.Application/    # Services, DTOs, interfaces
├── GameServer.Domain/         # Entities, enums
└── GameServer.Infrastructure/ # Repositories, file I/O
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `GameService.cs` |
| Interfaces | PascalCase with `I` prefix | `IGameRepository.cs` |
| Methods | PascalCase | `GetCurrentUser()` |
| Private fields | camelCase with `_` prefix | `_gameState` |
| Constants | PascalCase | `MaxPlayers` |

### Coding Standards

- 4-space indentation
- Use `var` when type is obvious
- Prefer async/await for I/O operations
- Use Options pattern for configuration

### Testing

```bash
dotnet test                              # Run all tests
dotnet test --collect:"XPlat Code Coverage"  # With coverage
```

- Use xUnit for test runner
- Use FluentAssertions for assertions
- Use NSubstitute for mocking

---

## Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `test:` | Adding or updating tests |
| `refactor:` | Code change without feature/fix |
| `style:` | Formatting, whitespace |
| `chore:` | Build, dependencies, tooling |

Examples:
```
feat: add timer sound configuration
fix: resolve chat message ordering issue
docs: update API endpoint documentation
test: add ChatBox component tests
```

## Pull Requests

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes with conventional commits
3. Run `ci-check.bat` from the repo root to verify lint, build, and tests pass for both frontend and backend before pushing
4. Push and open a PR against `main`
5. Fill out the PR template with:
   - Description of changes
   - Testing steps
   - Screenshots (for UI changes)

## Code Review

- Keep PRs small and focused
- Respond to feedback constructively
- Squash commits when merging if requested

## Questions?

Open an issue for questions or discussions about the codebase.
