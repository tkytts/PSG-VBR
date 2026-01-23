namespace GameServer.Domain.Entities;

/// <summary>
/// Configuration for audio chimes/notifications.
/// </summary>
public class ChimesConfig
{
    public bool MessageSent { get; set; }
    public bool MessageReceived { get; set; }
    public bool Timer { get; set; }
}
