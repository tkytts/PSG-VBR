using FluentAssertions;
using GameServer.Application.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Xunit;

namespace GameServer.Api.Tests;

public class GameHubTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> _factory;
    private HubConnection? _connection;

    public GameHubTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    public async Task InitializeAsync()
    {
        var client = _factory.CreateClient();
        _connection = new HubConnectionBuilder()
            .WithUrl(
                $"{client.BaseAddress}api/gamehub",
                options => options.HttpMessageHandlerFactory = _ => _factory.Server.CreateHandler())
            .Build();

        await _connection.StartAsync();
    }

    public async Task DisposeAsync()
    {
        if (_connection is not null)
        {
            await _connection.DisposeAsync();
        }
    }

    [Fact]
    public async Task Connection_CanBeEstablished()
    {
        // Assert
        _connection!.State.Should().Be(HubConnectionState.Connected);
    }

    [Fact]
    public async Task SendMessage_BroadcastsToAll()
    {
        // Arrange
        ChatMessageDto? receivedMessage = null;
        _connection!.On<ChatMessageDto>("ReceiveMessage", msg => receivedMessage = msg);

        // Act
        await _connection.InvokeAsync("SendMessage", new ChatMessageDto("TestUser", "Hello!"));
        await Task.Delay(100); // Allow time for message to arrive

        // Assert
        receivedMessage.Should().NotBeNull();
        receivedMessage!.User.Should().Be("TestUser");
        receivedMessage.Text.Should().Be("Hello!");
    }

    [Fact]
    public async Task StartGame_BroadcastsStatusUpdate()
    {
        // Arrange
        bool? gameStatus = null;
        _connection!.On<bool>("StatusUpdate", status => gameStatus = status);

        // Act
        await _connection.InvokeAsync("StartGame");
        await Task.Delay(100);

        // Assert
        gameStatus.Should().BeTrue();
    }

    [Fact]
    public async Task StopGame_BroadcastsStatusUpdate()
    {
        // Arrange
        bool? gameStatus = null;
        _connection!.On<bool>("StatusUpdate", status => gameStatus = status);

        // Act
        await _connection.InvokeAsync("StopGame");
        await Task.Delay(100);

        // Assert
        gameStatus.Should().BeFalse();
    }

    [Fact]
    public async Task ResetPoints_BroadcastsZeroScore()
    {
        // Arrange
        int? score = null;
        _connection!.On<int>("PointsUpdate", s => score = s);

        // Act
        await _connection.InvokeAsync("ResetPoints");
        await Task.Delay(100);

        // Assert
        score.Should().Be(0);
    }

    [Fact]
    public async Task SetConfederate_BroadcastsNewConfederate()
    {
        // Arrange
        string? confederate = null;
        _connection!.On<string>("NewConfederate", name => confederate = name);

        // Act
        await _connection.InvokeAsync("SetConfederate", "TestConfederate");
        await Task.Delay(100);

        // Assert
        confederate.Should().Be("TestConfederate");
    }

    [Fact]
    public async Task Typing_NotifiesOtherClients()
    {
        // Arrange - Create second connection
        var client = _factory.CreateClient();
        var connection2 = new HubConnectionBuilder()
            .WithUrl(
                $"{client.BaseAddress}api/gamehub",
                options => options.HttpMessageHandlerFactory = _ => _factory.Server.CreateHandler())
            .Build();
        await connection2.StartAsync();

        string? typingUser = null;
        connection2.On<string>("UserTyping", username => typingUser = username);

        // Act
        await _connection!.InvokeAsync("Typing", "User1");
        await Task.Delay(100);

        // Assert
        typingUser.Should().Be("User1");

        // Cleanup
        await connection2.DisposeAsync();
    }
}
