using FluentAssertions;
using GameServer.Application.Interfaces;
using GameServer.Application.Services;
using GameServer.Domain.Entities;
using NSubstitute;
using Xunit;

namespace GameServer.Application.Tests.Services;

public class ChatServiceTests
{
    private readonly GameState _state;
    private readonly IChatLogRepository _chatLogRepository;
    private readonly ChatService _sut;

    public ChatServiceTests()
    {
        _state = new GameState();
        _chatLogRepository = Substitute.For<IChatLogRepository>();
        _sut = new ChatService(_state, _chatLogRepository);
    }

    [Fact]
    public void AddMessage_AddsToState()
    {
        // Arrange
        var message = new Message { User = "TestUser", Text = "Hello" };

        // Act
        _sut.AddMessage(message);

        // Assert
        _state.Messages.Should().ContainSingle();
        _state.Messages[0].User.Should().Be("TestUser");
        _state.Messages[0].Text.Should().Be("Hello");
    }

    [Fact]
    public async Task ClearAndSaveAsync_ClearsMessagesAndSaves()
    {
        // Arrange
        _sut.AddMessage(new Message { User = "User1", Text = "Message 1" });
        _sut.AddMessage(new Message { User = "User2", Text = "Message 2" });

        // Act
        var cleared = await _sut.ClearAndSaveAsync();

        // Assert
        cleared.Should().HaveCount(2);
        _state.Messages.Should().BeEmpty();
        await _chatLogRepository.Received(1).SaveAsync(Arg.Is<IReadOnlyList<Message>>(m => m.Count == 2));
    }

    [Fact]
    public async Task ClearAndSaveAsync_WithNoMessages_StillCallsRepository()
    {
        // Act
        var cleared = await _sut.ClearAndSaveAsync();

        // Assert
        cleared.Should().BeEmpty();
        await _chatLogRepository.Received(1).SaveAsync(Arg.Any<IReadOnlyList<Message>>());
    }
}
