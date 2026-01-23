namespace GameServer.Domain.Entities;

/// <summary>
/// Represents a chat message in the game.
/// </summary>
public class Message
{
    public required string User { get; init; }
    public required string Text { get; init; }
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;

    public string FormattedTimestamp => Timestamp.ToString("HH:mm:ss");
}
