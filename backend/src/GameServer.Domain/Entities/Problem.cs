namespace GameServer.Domain.Entities;

/// <summary>
/// Represents a single problem within a block.
/// </summary>
public class Problem
{
    public required string Id { get; init; }
    public required string Question { get; init; }
    public required string Answer { get; init; }
    public string? ImageUrl { get; init; }
    public Dictionary<string, object> Metadata { get; init; } = new();
}
