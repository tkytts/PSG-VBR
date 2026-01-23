namespace GameServer.Domain.Enums;

/// <summary>
/// Represents the different ways a game round can be resolved.
/// </summary>
public enum GameResolutionType
{
    /// <summary>Answered correctly with points awarded.</summary>
    AP,
    
    /// <summary>Answered but no points (incorrect).</summary>
    ANP,
    
    /// <summary>Delegated correctly with points awarded.</summary>
    DP,
    
    /// <summary>Delegated but no points (incorrect).</summary>
    DNP,
    
    /// <summary>Timeout - no points awarded.</summary>
    TNP
}
