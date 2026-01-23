# GameServer Backend

A real-time multiplayer game server built with .NET 8, SignalR, and clean architecture principles. Originally designed for research data collection in collaborative problem-solving studies.

## Quick Start

```bash
cd backend
dotnet restore
dotnet run --project src/GameServer.Api
```

The server starts at `http://localhost:5000` (HTTPS: `https://localhost:5001`)

## Architecture

This solution follows **Clean Architecture** principles:

```
┌──────────────────────────────────────────────────────────┐
│                    GameServer.Api                        │
│            (Controllers, SignalR Hubs)                   │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                 GameServer.Application                   │
│        (Services, DTOs, Interfaces, Business Logic)      │
└──────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌─────────────────────────┐  ┌─────────────────────────────┐
│   GameServer.Domain     │  │  GameServer.Infrastructure  │
│  (Entities, Enums)      │  │  (Repositories, File I/O)   │
└─────────────────────────┘  └─────────────────────────────┘
```

### Project Structure

```
backend/
├── src/
│   ├── GameServer.Api/            # Web API and SignalR hub
│   ├── GameServer.Application/    # Business logic and DTOs
│   ├── GameServer.Domain/         # Core entities and enums
│   └── GameServer.Infrastructure/ # Data access and file I/O
└── tests/
    ├── GameServer.Api.Tests/
    ├── GameServer.Application.Tests/
    └── GameServer.Infrastructure.Tests/
```

## Features

- **Real-time Communication**: SignalR hub for instant message broadcasting
- **Game State Management**: Centralized `GameState` class with thread-safe operations
- **Problem Navigation**: Block/problem selection with configurable content
- **Scoring System**: Points tracking with multiple resolution types
- **Timer System**: Configurable countdown with timeout handling
- **Telemetry**: CSV logging for research data collection
- **Chat System**: Real-time messaging with persistence

## API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blocks` | Get all game blocks |
| GET | `/api/currentUser` | Get current participant name |

### SignalR Hub (`/api/gamehub`)

#### Client → Server Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `SetParticipantName` | `string name` | Set participant name |
| `SetConfederate` | `string name` | Set confederate name |
| `SendMessage` | `ChatMessageDto` | Send chat message |
| `Typing` | `string username` | Notify typing |
| `ClearChat` | - | Clear and save chat |
| `FirstBlock` | - | Go to first block |
| `NextBlock` | - | Go to next block |
| `NextProblem` | - | Go to next problem |
| `StartTimer` | - | Start countdown |
| `StopTimer` | - | Stop countdown |
| `ResetTimer` | - | Reset countdown |
| `StartGame` | - | Start game session |
| `StopGame` | - | Stop game session |
| `SetGameResolution` | `SetGameResolutionDto` | Resolve game round |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `ReceiveMessage` | `ChatMessageDto` | New chat message |
| `UserTyping` | `string` | User is typing |
| `ChatCleared` | - | Chat was cleared |
| `ProblemUpdate` | `ProblemUpdateDto` | Problem changed |
| `TimerUpdate` | `int` | Timer tick |
| `StatusUpdate` | `bool` | Game live status |
| `GameResolved` | `GameResolutionDto` | Round resolved |
| `PointsUpdate` | `int` | Score changed |
| `NewConfederate` | `string` | Confederate changed |

## Configuration

Edit `src/GameServer.Api/appsettings.json`:

```json
{
  "Game": {
    "MaxTime": 120,
    "PointsAwarded": 100,
    "LogPath": "logs"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000"
    ]
  }
}
```

| Setting | Default | Description |
|---------|---------|-------------|
| `Game:MaxTime` | 120 | Timer duration in seconds |
| `Game:PointsAwarded` | 100 | Points per correct answer |
| `Game:LogPath` | logs | Directory for CSV/log files |
| `Cors:AllowedOrigins` | - | Allowed frontend URLs |

## Testing

```bash
# Run all tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test tests/GameServer.Application.Tests
```

### Test Projects

| Project | Description |
|---------|-------------|
| `GameServer.Api.Tests` | Controller and SignalR hub tests |
| `GameServer.Application.Tests` | Service and business logic tests |
| `GameServer.Infrastructure.Tests` | Repository and file I/O tests |

### Test Frameworks

- **xUnit**: Test runner
- **FluentAssertions**: Readable assertions
- **NSubstitute**: Mocking

## Design Decisions

1. **Singleton GameState**: Shared across all SignalR connections for consistent state
2. **Repository Pattern**: Abstracts file I/O for testability
3. **Options Pattern**: Strongly-typed configuration
4. **Thread-Safe State**: Locking in GameState for concurrent access
5. **CSV Logging**: Research-friendly output format (one file per user per day)

## Related Documentation

- [Project Overview](../README.md)
- [Frontend README](../frontend/README.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## License

MIT
