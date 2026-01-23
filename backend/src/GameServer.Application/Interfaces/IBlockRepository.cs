using GameServer.Domain.Entities;

namespace GameServer.Application.Interfaces;

/// <summary>
/// Repository for accessing game blocks.
/// </summary>
public interface IBlockRepository
{
    /// <summary>
    /// Gets all available blocks.
    /// </summary>
    Task<IReadOnlyList<Block>> GetAllAsync();

    /// <summary>
    /// Gets a specific block by index.
    /// </summary>
    Task<Block?> GetByIndexAsync(int index);
}
