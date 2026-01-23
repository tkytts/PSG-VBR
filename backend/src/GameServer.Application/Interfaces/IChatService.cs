using GameServer.Domain.Entities;

namespace GameServer.Application.Interfaces;

/// <summary>
/// Service for managing chat functionality.
/// </summary>
public interface IChatService
{
    /// <summary>
    /// Adds a message to the chat.
    /// </summary>
    void AddMessage(Message message);

    /// <summary>
    /// Clears all messages and saves them to the log.
    /// </summary>
    Task<IReadOnlyList<Message>> ClearAndSaveAsync();
}
