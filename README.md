# Experiment Platform

A full-stack application for running behavioral experiments with real-time communication. Built with React and .NET 8.

## Project Structure

```
├── frontend/          # React application
├── backend/           # .NET 8 API with SignalR
├── CONTRIBUTING.md    # Contribution guidelines
└── README.md          # This file
```

## Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/) and npm
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Run Backend

```bash
cd backend
dotnet restore
dotnet run --project src/GameServer.Api
```

Backend runs at `http://localhost:5000`

### Run Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

## Documentation

| Document | Description |
|----------|-------------|
| [Frontend README](./frontend/README.md) | React app setup, routes, and testing |
| [Backend README](./backend/README.md) | API endpoints, SignalR events, configuration |
| [Contributing Guidelines](./CONTRIBUTING.md) | Coding standards and PR process |

## Features

- **Real-time Communication** - SignalR for instant messaging and game state updates
- **Multi-language Support** - English and Portuguese via i18next
- **Role-based Views** - Separate interfaces for participants and experimenters
- **Game State Management** - Timer, scoring, and problem navigation
- **Research Telemetry** - CSV logging for data collection

## Configuration

### Frontend Environment Variables

Create `frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_HUB_URL=http://localhost:5000/api/gamehub
```

### Backend Configuration

Edit `backend/src/GameServer.Api/appsettings.json`:

```json
{
  "Game": {
    "MaxTime": 120,
    "PointsAwarded": 100,
    "LogPath": "logs"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

## Testing

### Frontend Tests

```bash
cd frontend
npm test              # Watch mode
npm run test:ci       # Single run
npm run test:coverage # With coverage
```

### Backend Tests

```bash
cd backend
dotnet test
```

## Tech Stack

### Frontend
- React 18, React Router 6
- SignalR Client
- i18next
- Bootstrap 5
- Jest + React Testing Library

### Backend
- .NET 8, ASP.NET Core
- SignalR
- Clean Architecture
- xUnit, FluentAssertions, NSubstitute

## License

MIT
