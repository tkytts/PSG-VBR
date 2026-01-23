namespace GameServer.Domain.Entities;

/// <summary>
/// Represents a block as defined in blocks.json.
/// </summary>
public class Block
{
    public required string BlockName { get; init; }
    public required List<string> Problems { get; init; }
}