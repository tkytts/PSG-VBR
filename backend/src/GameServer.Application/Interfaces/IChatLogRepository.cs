using GameServer.Domain.Entities;

namespace GameServer.Application.Interfaces;

/// <summary>
/// Repository for saving chat logs.
/// </summary>
public interface IChatLogRepository
{
    /// <summary>
    /// Saves chat messages to a log file.
    /// </summary>
    Task SaveAsync(IReadOnlyList<Message> messages);

    /// <summary>
    /// Saves tutorial completion data.
    /// </summary>
    Task SaveTutorialLogAsync(int numberOfTries);
}
