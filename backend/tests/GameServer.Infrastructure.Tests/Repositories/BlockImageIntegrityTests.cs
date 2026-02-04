using FluentAssertions;
using GameServer.Infrastructure.Repositories;
using Xunit;

namespace GameServer.Infrastructure.Tests.Repositories;

/// <summary>
/// Verifies that blocks.json and frontend/public/problems/ stay in sync.
/// Every problem declared in a block must have a matching .png, and every
/// .png in a Block_* folder must be declared in blocks.json.
/// </summary>
public class BlockImageIntegrityTests
{
    private static readonly string RepoRoot = FindRepoRoot();
    private static readonly string BlocksJsonPath =
        Path.Combine(RepoRoot, "backend", "src", "GameServer.Api", "Resources", "blocks.json");
    private static readonly string ProblemsRoot =
        Path.Combine(RepoRoot, "frontend", "public", "problems");

    [Fact]
    public async Task EachDeclaredProblem_HasAMatchingImage()
    {
        var repository = new JsonBlockRepository(BlocksJsonPath);
        var blocks = await repository.GetAllAsync();
        blocks.Should().NotBeEmpty("blocks.json should contain at least one block");

        var missing = new List<string>();
        foreach (var block in blocks)
        {
            foreach (var problem in block.Problems)
            {
                var expectedPath = Path.Combine(ProblemsRoot, block.BlockName, $"{problem}.png");
                if (!File.Exists(expectedPath))
                    missing.Add($"problems/{block.BlockName}/{problem}.png");
            }
        }

        missing.Should().BeEmpty("Every problem in blocks.json must have a corresponding image file");
    }

    [Fact]
    public async Task EachImageInBlockFolder_IsDeclaredInBlocksJson()
    {
        var repository = new JsonBlockRepository(BlocksJsonPath);
        var blocks = await repository.GetAllAsync();

        var declared = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var block in blocks)
            foreach (var problem in block.Problems)
                declared.Add(Path.Combine(block.BlockName, $"{problem}.png"));

        var orphaned = new List<string>();
        foreach (var dir in Directory.GetDirectories(ProblemsRoot, "Block_*"))
        {
            var blockName = Path.GetFileName(dir);
            foreach (var file in Directory.GetFiles(dir, "*.png"))
            {
                var relative = Path.Combine(blockName, Path.GetFileName(file));
                if (!declared.Contains(relative))
                    orphaned.Add($"problems/{relative}");
            }
        }

        orphaned.Should().BeEmpty("Every image in a Block_* folder must be declared in blocks.json");
    }

    private static string FindRepoRoot()
    {
        var dir = Path.GetDirectoryName(typeof(BlockImageIntegrityTests).Assembly.Location);
        while (dir != null)
        {
            if (File.Exists(Path.Combine(dir, "docker-compose.yml")))
                return dir;
            dir = Directory.GetParent(dir)?.FullName;
        }

        throw new DirectoryNotFoundException(
            "Could not locate repository root. Expected docker-compose.yml at the top level.");
    }
}
