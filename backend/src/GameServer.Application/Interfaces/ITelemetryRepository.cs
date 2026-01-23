using GameServer.Domain.Entities;

namespace GameServer.Application.Interfaces;

/// <summary>
/// Repository for saving telemetry data.
/// </summary>
public interface ITelemetryRepository
{
    /// <summary>
    /// Saves a telemetry event to persistent storage.
    /// </summary>
    Task SaveAsync(TelemetryEvent telemetryEvent);
}
