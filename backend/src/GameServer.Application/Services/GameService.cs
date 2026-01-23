using GameServer.Application.Interfaces;
using GameServer.Domain.Entities;
using GameServer.Domain.Enums;
using Microsoft.Extensions.Options;

namespace GameServer.Application.Services;

/// <summary>
/// Manages core game logic including problem navigation and scoring.
/// </summary>
public class GameService : IGameService
{
    private readonly GameState _state;
    private readonly IBlockRepository _blockRepository;
    private IReadOnlyList<Block>? _blocksCache;
    private int _pointsAwarded;

    public GameService(
        GameState state,
        IBlockRepository blockRepository,
        IOptions<GameSettings> settings)
    {
        _state = state;
        _blockRepository = blockRepository;
        _pointsAwarded = settings.Value.PointsAwarded;
    }

    public GameState State => _state;

    public int PointsAwarded
    {
        get => _pointsAwarded;
        set => _pointsAwarded = value;
    }

    public void StartGame()
    {
        _state.Start();
    }

    public void StopGame()
    {
        _state.Stop();
    }

    public void SetProblemSelection(int blockIndex, int problemIndex)
    {
        _state.SetProblemSelection(blockIndex, problemIndex);
    }

    public (Block? Block, string? Problem) FirstBlock()
    {
        _state.FirstBlock();
        return GetCurrentProblem();
    }

    public (Block? Block, string? Problem) NextBlock()
    {
        _state.NextBlock();
        return GetCurrentProblem();
    }

    public (Block? Block, string? Problem) NextProblem()
    {
        _state.NextProblem();
        return GetCurrentProblem();
    }

    public (Block? Block, string? Problem) GetCurrentProblem()
    {
        var blocks = GetBlocksSync();

        if (!_state.CurrentBlockIndex.HasValue ||
            _state.CurrentBlockIndex < 0 ||
            _state.CurrentBlockIndex >= blocks.Count)
        {
            return (null, null);
        }

        var block = blocks[_state.CurrentBlockIndex.Value];

        if (!_state.CurrentProblemIndex.HasValue ||
            _state.CurrentProblemIndex < 0 ||
            _state.CurrentProblemIndex >= block.Problems.Count)
        {
            return (block, null);
        }

        var problem = block.Problems[_state.CurrentProblemIndex.Value];
        return (block, problem);
    }

    public GameResolution ResolveGame(GameResolutionType resolutionType, string? teamAnswer)
    {
        var isCorrect = resolutionType is GameResolutionType.AP or GameResolutionType.DP;
        var pointsAwarded = isCorrect ? _pointsAwarded : 0;

        if (isCorrect)
        {
            _state.AwardPoints(pointsAwarded);
        }

        // Clear team answer on timeout
        var finalAnswer = resolutionType == GameResolutionType.TNP ? null : teamAnswer;

        return new GameResolution
        {
            IsAnswerCorrect = isCorrect,
            PointsAwarded = pointsAwarded,
            CurrentScore = _state.CurrentScore,
            TeamAnswer = finalAnswer
        };
    }

    public void ResetScore()
    {
        _state.ResetScore();
    }

    private IReadOnlyList<Block> GetBlocksSync()
    {
        // Cache blocks since they don't change during runtime
        _blocksCache ??= _blockRepository.GetAllAsync().GetAwaiter().GetResult();
        return _blocksCache;
    }
}