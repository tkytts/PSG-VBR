using GameServer.Domain.Enums;

namespace GameServer.Domain.Entities;

/// <summary>
/// Represents the complete state of a game session.
/// This replaces all the scattered 'let' variables from the original server.js.
/// </summary>
public class GameState
{
    private readonly object _lock = new();

    public List<Message> Messages { get; private set; } = new();
    public string? ParticipantName { get; set; }
    public string? ConfederateName { get; set; }
    public int CurrentScore { get; private set; }
    public int? CurrentBlockIndex { get; private set; }
    public int? CurrentProblemIndex { get; private set; }
    public bool IsLive { get; private set; }
    public ChimesConfig? ChimesConfig { get; set; }
    public GameResolutionType? PendingResolutionType { get; set; }
    public string? TeamAnswer { get; set; }

    /// <summary>
    /// Adds a message to the chat history.
    /// </summary>
    public void AddMessage(Message message)
    {
        lock (_lock)
        {
            Messages.Add(message);
        }
    }

    /// <summary>
    /// Clears all messages and returns them for logging.
    /// </summary>
    public IReadOnlyList<Message> ClearMessages()
    {
        lock (_lock)
        {
            var messages = Messages.ToList();
            Messages = new List<Message>();
            return messages;
        }
    }

    /// <summary>
    /// Starts the game session.
    /// </summary>
    public void Start()
    {
        IsLive = true;
    }

    /// <summary>
    /// Stops the game session.
    /// </summary>
    public void Stop()
    {
        IsLive = false;
    }

    /// <summary>
    /// Sets the current problem selection.
    /// </summary>
    public void SetProblemSelection(int blockIndex, int problemIndex)
    {
        CurrentBlockIndex = blockIndex;
        CurrentProblemIndex = problemIndex;
    }

    /// <summary>
    /// Moves to the first block.
    /// </summary>
    public void FirstBlock()
    {
        CurrentBlockIndex = 0;
        CurrentProblemIndex = 0;
    }

    /// <summary>
    /// Moves to the next block.
    /// </summary>
    public void NextBlock()
    {
        CurrentBlockIndex = CurrentBlockIndex >= 0 ? CurrentBlockIndex + 1 : 0;
        CurrentProblemIndex = 0;
    }

    /// <summary>
    /// Moves to the next problem within the current block.
    /// </summary>
    /// <param name="maxProblems">Maximum number of problems in a block (default 5).</param>
    public void NextProblem(int maxProblems = 5)
    {
        if (CurrentProblemIndex.HasValue && CurrentProblemIndex < maxProblems - 1)
            CurrentProblemIndex++;
        else
            CurrentProblemIndex = 0;
    }

    /// <summary>
    /// Awards points to the current score.
    /// </summary>
    public void AwardPoints(int points)
    {
        lock (_lock)
        {
            CurrentScore += points;
        }
    }

    /// <summary>
    /// Resets the score to zero.
    /// </summary>
    public void ResetScore()
    {
        lock (_lock)
        {
            CurrentScore = 0;
        }
    }

    /// <summary>
    /// Resets the entire game state to initial values.
    /// </summary>
    public void Reset()
    {
        lock (_lock)
        {
            Messages = new List<Message>();
            CurrentScore = 0;
            CurrentBlockIndex = null;
            CurrentProblemIndex = null;
            IsLive = false;
            PendingResolutionType = null;
            TeamAnswer = null;
        }
    }
}
