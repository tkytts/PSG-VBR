using System.Text.Json;
using GameServer.Application.Interfaces;
using GameServer.Domain.Entities;

namespace GameServer.Infrastructure.Repositories;

/// <summary>
/// Repository that loads blocks from a JSON file.
/// </summary>
public class JsonBlockRepository : IBlockRepository
{
    private readonly string _filePath;
    private IReadOnlyList<Block>? _cache;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public JsonBlockRepository(string filePath = "Resources/blocks.json")
    {
        _filePath = filePath;
    }

    public async Task<IReadOnlyList<Block>> GetAllAsync()
    {
        if (_cache is not null)
            return _cache;

        if (!File.Exists(_filePath))
            return Array.Empty<Block>();

        var json = await File.ReadAllTextAsync(_filePath);
        _cache = JsonSerializer.Deserialize<List<Block>>(json, JsonOptions) ?? new List<Block>();
        return _cache;
    }

    public async Task<Block?> GetByIndexAsync(int index)
    {
        var blocks = await GetAllAsync();
        return index >= 0 && index < blocks.Count ? blocks[index] : null;
    }
}
