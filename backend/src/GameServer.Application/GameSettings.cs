namespace GameServer.Application;

/// <summary>
/// Configuration settings for the game, mapped from appsettings.json.
/// </summary>
public class GameSettings
{
    public const string SectionName = "Game";

    public int MaxTime { get; set; } = 120;
    public int PointsAwarded { get; set; } = 100;
    public string LogPath { get; set; } = "logs";
}
