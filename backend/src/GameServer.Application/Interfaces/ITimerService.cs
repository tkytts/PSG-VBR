namespace GameServer.Application.Interfaces;

/// <summary>
/// Service for managing the game timer.
/// </summary>
public interface ITimerService
{
    /// <summary>
    /// Gets the current countdown value.
    /// </summary>
    int CurrentCountdown { get; }

    /// <summary>
    /// Gets or sets the maximum time for the timer.
    /// </summary>
    int MaxTime { get; set; }

    /// <summary>
    /// Gets whether the timer is currently running.
    /// </summary>
    bool IsRunning { get; }

    /// <summary>
    /// Event fired every second with the remaining time.
    /// </summary>
    event Action<int>? OnTick;

    /// <summary>
    /// Event fired when the timer reaches zero.
    /// </summary>
    event Action? OnTimeout;

    /// <summary>
    /// Starts the timer.
    /// </summary>
    void Start();

    /// <summary>
    /// Stops the timer.
    /// </summary>
    void Stop();

    /// <summary>
    /// Resets the timer to the maximum time.
    /// </summary>
    void Reset();
}
