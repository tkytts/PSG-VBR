using GameServer.Api.Hubs;
using GameServer.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace GameServer.Api.Services
{
    public class TimerBroadcastService : IHostedService
    {
        private readonly ITimerService _timerService;
        private readonly IHubContext<GameHub> _hubContext;

        public TimerBroadcastService(ITimerService timerService, IHubContext<GameHub> hubContext)
        {
            _timerService = timerService;
            _hubContext = hubContext;
            _timerService.OnTick += async (countdown) =>
            {
                await _hubContext.Clients.All.SendAsync("TimerUpdate", countdown);
            };
        }

        public Task StartAsync(CancellationToken cancellationToken) => Task.CompletedTask;
        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}