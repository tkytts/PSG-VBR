using GameServer.Application;
using GameServer.Application.Interfaces;
using GameServer.Domain.Entities;
using Microsoft.Extensions.Options;

namespace GameServer.Infrastructure.Repositories;

/// <summary>
/// Repository that saves chat logs to text files.
/// </summary>
public class FileChatLogRepository : IChatLogRepository
{
    private readonly string _logPath;

    public FileChatLogRepository(IOptions<GameSettings> settings)
    {
        _logPath = settings.Value.LogPath;
        EnsureDirectoryExists();
    }

    public async Task SaveAsync(IReadOnlyList<Message> messages)
    {
        if (messages.Count == 0) return;

        var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd_HH-mm-ss");
        var filePath = Path.Combine(_logPath, $"chat_logs_{timestamp}.txt");

        var content = $"Chat Log - {timestamp}\n\n" +
            string.Join("\n", messages.Select(m => 
                $"{m.FormattedTimestamp} - {m.User}: {m.Text}"));

        await File.WriteAllTextAsync(filePath, content);
    }

    public async Task SaveTutorialLogAsync(int numberOfTries)
    {
        var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd_HH-mm-ss");
        var filePath = Path.Combine(_logPath, $"tutorial_logs_{timestamp}.txt");

        var content = $"Tutorial Log - {timestamp}\n\nTries: {numberOfTries}";
        await File.WriteAllTextAsync(filePath, content);
    }

    private void EnsureDirectoryExists()
    {
        if (!Directory.Exists(_logPath))
        {
            Directory.CreateDirectory(_logPath);
        }
    }
}
