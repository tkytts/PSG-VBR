using GameServer.Application.Interfaces;
using GameServer.Domain.Entities;

namespace GameServer.Application.Services;

/// <summary>
/// Manages chat messages and logging.
/// </summary>
public class ChatService : IChatService
{
    private readonly GameState _state;
    private readonly IChatLogRepository _chatLogRepository;

    public ChatService(GameState state, IChatLogRepository chatLogRepository)
    {
        _state = state;
        _chatLogRepository = chatLogRepository;
    }

    public void AddMessage(Message message)
    {
        _state.AddMessage(message);
    }

    public async Task<IReadOnlyList<Message>> ClearAndSaveAsync()
    {
        var messages = _state.ClearMessages();
        await _chatLogRepository.SaveAsync(messages);
        return messages;
    }
}
