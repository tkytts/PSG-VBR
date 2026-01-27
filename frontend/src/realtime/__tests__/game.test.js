// Mock connection before importing game module
const mockOn = jest.fn();
const mockOff = jest.fn();
const mockInvoke = jest.fn();
const mockOnreconnected = jest.fn();

jest.mock('../../connection', () => ({
  __esModule: true,
  default: {
    on: mockOn,
    off: mockOff,
    invoke: mockInvoke,
    onreconnected: mockOnreconnected
  },
  connectionReady: Promise.resolve()
}));

describe('realtime/game module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('event handlers - onSafe/offSafe', () => {
    const game = require('../game');

    describe('onTutorialDone', () => {
      it('registers handler for TutorialDone event', () => {
        const handler = jest.fn();
        game.onTutorialDone(handler);
        expect(mockOn).toHaveBeenCalledWith('TutorialDone', handler);
      });

      it('does not register if handler is null', () => {
        game.onTutorialDone(null);
        expect(mockOn).not.toHaveBeenCalled();
      });
    });

    describe('offTutorialDone', () => {
      it('unregisters handler for TutorialDone event', () => {
        const handler = jest.fn();
        game.offTutorialDone(handler);
        expect(mockOff).toHaveBeenCalledWith('TutorialDone', handler);
      });

      it('does not unregister if handler is null', () => {
        game.offTutorialDone(null);
        expect(mockOff).not.toHaveBeenCalled();
      });
    });

    describe('onStatusUpdate', () => {
      it('registers handler for StatusUpdate event', () => {
        const handler = jest.fn();
        game.onStatusUpdate(handler);
        expect(mockOn).toHaveBeenCalledWith('StatusUpdate', handler);
      });
    });

    describe('offStatusUpdate', () => {
      it('unregisters handler for StatusUpdate event', () => {
        const handler = jest.fn();
        game.offStatusUpdate(handler);
        expect(mockOff).toHaveBeenCalledWith('StatusUpdate', handler);
      });
    });

    describe('onNewConfederate', () => {
      it('registers handler for NewConfederate event', () => {
        const handler = jest.fn();
        game.onNewConfederate(handler);
        expect(mockOn).toHaveBeenCalledWith('NewConfederate', handler);
      });
    });

    describe('offNewConfederate', () => {
      it('unregisters handler for NewConfederate event', () => {
        const handler = jest.fn();
        game.offNewConfederate(handler);
        expect(mockOff).toHaveBeenCalledWith('NewConfederate', handler);
      });
    });

    describe('onShowEndModal', () => {
      it('registers handler for ShowEndModal event', () => {
        const handler = jest.fn();
        game.onShowEndModal(handler);
        expect(mockOn).toHaveBeenCalledWith('ShowEndModal', handler);
      });
    });

    describe('offShowEndModal', () => {
      it('unregisters handler for ShowEndModal event', () => {
        const handler = jest.fn();
        game.offShowEndModal(handler);
        expect(mockOff).toHaveBeenCalledWith('ShowEndModal', handler);
      });
    });

    describe('onReceiveMessage', () => {
      it('registers handler for ReceiveMessage event', () => {
        const handler = jest.fn();
        game.onReceiveMessage(handler);
        expect(mockOn).toHaveBeenCalledWith('ReceiveMessage', handler);
      });
    });

    describe('offReceiveMessage', () => {
      it('unregisters handler for ReceiveMessage event', () => {
        const handler = jest.fn();
        game.offReceiveMessage(handler);
        expect(mockOff).toHaveBeenCalledWith('ReceiveMessage', handler);
      });
    });

    describe('onTimerUpdate', () => {
      it('registers handler for TimerUpdate event', () => {
        const handler = jest.fn();
        game.onTimerUpdate(handler);
        expect(mockOn).toHaveBeenCalledWith('TimerUpdate', handler);
      });
    });

    describe('offTimerUpdate', () => {
      it('unregisters handler for TimerUpdate event', () => {
        const handler = jest.fn();
        game.offTimerUpdate(handler);
        expect(mockOff).toHaveBeenCalledWith('TimerUpdate', handler);
      });
    });

    describe('onSetAnswer', () => {
      it('registers handler for SetAnswer event', () => {
        const handler = jest.fn();
        game.onSetAnswer(handler);
        expect(mockOn).toHaveBeenCalledWith('SetAnswer', handler);
      });
    });

    describe('offSetAnswer', () => {
      it('unregisters handler for SetAnswer event', () => {
        const handler = jest.fn();
        game.offSetAnswer(handler);
        expect(mockOff).toHaveBeenCalledWith('SetAnswer', handler);
      });
    });

    describe('onGameResolved', () => {
      it('registers handler for GameResolved event', () => {
        const handler = jest.fn();
        game.onGameResolved(handler);
        expect(mockOn).toHaveBeenCalledWith('GameResolved', handler);
      });
    });

    describe('offGameResolved', () => {
      it('unregisters handler for GameResolved event', () => {
        const handler = jest.fn();
        game.offGameResolved(handler);
        expect(mockOff).toHaveBeenCalledWith('GameResolved', handler);
      });
    });

    describe('onProblemUpdate', () => {
      it('registers handler for ProblemUpdate event', () => {
        const handler = jest.fn();
        game.onProblemUpdate(handler);
        expect(mockOn).toHaveBeenCalledWith('ProblemUpdate', handler);
      });
    });

    describe('offProblemUpdate', () => {
      it('unregisters handler for ProblemUpdate event', () => {
        const handler = jest.fn();
        game.offProblemUpdate(handler);
        expect(mockOff).toHaveBeenCalledWith('ProblemUpdate', handler);
      });
    });

    describe('onUserTyping', () => {
      it('registers handler for UserTyping event', () => {
        const handler = jest.fn();
        game.onUserTyping(handler);
        expect(mockOn).toHaveBeenCalledWith('UserTyping', handler);
      });
    });

    describe('offUserTyping', () => {
      it('unregisters handler for UserTyping event', () => {
        const handler = jest.fn();
        game.offUserTyping(handler);
        expect(mockOff).toHaveBeenCalledWith('UserTyping', handler);
      });
    });

    describe('onChatCleared', () => {
      it('registers handler for ChatCleared event', () => {
        const handler = jest.fn();
        game.onChatCleared(handler);
        expect(mockOn).toHaveBeenCalledWith('ChatCleared', handler);
      });
    });

    describe('offChatCleared', () => {
      it('unregisters handler for ChatCleared event', () => {
        const handler = jest.fn();
        game.offChatCleared(handler);
        expect(mockOff).toHaveBeenCalledWith('ChatCleared', handler);
      });
    });

    describe('onChimesUpdated', () => {
      it('registers handler for ChimesUpdated event', () => {
        const handler = jest.fn();
        game.onChimesUpdated(handler);
        expect(mockOn).toHaveBeenCalledWith('ChimesUpdated', handler);
      });
    });

    describe('offChimesUpdated', () => {
      it('unregisters handler for ChimesUpdated event', () => {
        const handler = jest.fn();
        game.offChimesUpdated(handler);
        expect(mockOff).toHaveBeenCalledWith('ChimesUpdated', handler);
      });
    });

    describe('onReconnected', () => {
      it('registers reconnection handler', () => {
        const handler = jest.fn();
        game.onReconnected(handler);
        expect(mockOnreconnected).toHaveBeenCalledWith(handler);
      });

      it('does not register if handler is null', () => {
        game.onReconnected(null);
        expect(mockOnreconnected).not.toHaveBeenCalled();
      });
    });
  });

  describe('invoke commands', () => {
    const game = require('../game');

    beforeEach(() => {
      mockInvoke.mockResolvedValue(undefined);
    });

    describe('game flow commands', () => {
      it('startGame invokes StartGame', async () => {
        await game.startGame();
        expect(mockInvoke).toHaveBeenCalledWith('StartGame');
      });

      it('blockFinished invokes BlockFinished', async () => {
        await game.blockFinished();
        expect(mockInvoke).toHaveBeenCalledWith('BlockFinished');
      });

      it('gameEnded invokes GameEnded', async () => {
        await game.gameEnded();
        expect(mockInvoke).toHaveBeenCalledWith('GameEnded');
      });
    });

    describe('problem cycle commands', () => {
      it('nextProblem invokes NextProblem', async () => {
        await game.nextProblem();
        expect(mockInvoke).toHaveBeenCalledWith('NextProblem');
      });

      it('resetTimer invokes ResetTimer', async () => {
        await game.resetTimer();
        expect(mockInvoke).toHaveBeenCalledWith('ResetTimer');
      });

      it('startTimer invokes StartTimer', async () => {
        await game.startTimer();
        expect(mockInvoke).toHaveBeenCalledWith('StartTimer');
      });

      it('stopTimer invokes StopTimer', async () => {
        await game.stopTimer();
        expect(mockInvoke).toHaveBeenCalledWith('StopTimer');
      });
    });

    describe('chat/answer commands', () => {
      it('clearChat invokes ClearChat', async () => {
        await game.clearChat();
        expect(mockInvoke).toHaveBeenCalledWith('ClearChat');
      });

      it('clearAnswer invokes ClearAnswer', async () => {
        await game.clearAnswer();
        expect(mockInvoke).toHaveBeenCalledWith('ClearAnswer');
      });
    });

    describe('game config commands', () => {
      it('setPointsAwarded invokes SetPointsAwarded with points', async () => {
        await game.setPointsAwarded(100);
        expect(mockInvoke).toHaveBeenCalledWith('SetPointsAwarded', 100);
      });

      it('setMaxTime invokes SetMaxTime with seconds', async () => {
        await game.setMaxTime(60);
        expect(mockInvoke).toHaveBeenCalledWith('SetMaxTime', 60);
      });

      it('setConfederate invokes SetConfederate with name', async () => {
        await game.setConfederate('TestBot');
        expect(mockInvoke).toHaveBeenCalledWith('SetConfederate', 'TestBot');
      });

      it('setChimes invokes SetChimes with options', async () => {
        const options = { enabled: true, volume: 0.5 };
        await game.setChimes(options);
        expect(mockInvoke).toHaveBeenCalledWith('SetChimes', options);
      });

      it('updateProblemSelection invokes UpdateProblemSelection with payload', async () => {
        const payload = { problemId: 1, selected: true };
        await game.updateProblemSelection(payload);
        expect(mockInvoke).toHaveBeenCalledWith('UpdateProblemSelection', payload);
      });
    });

    describe('message and tutorial commands', () => {
      it('typing invokes Typing with user', async () => {
        await game.typing('user1');
        expect(mockInvoke).toHaveBeenCalledWith('Typing', 'user1');
      });

      it('sendMessage invokes SendMessage with payload', async () => {
        const payload = { text: 'Hello', user: 'user1' };
        await game.sendMessage(payload);
        expect(mockInvoke).toHaveBeenCalledWith('SendMessage', payload);
      });

      it('setAnswer invokes SetAnswer with answer', async () => {
        await game.setAnswer('42');
        expect(mockInvoke).toHaveBeenCalledWith('SetAnswer', '42');
      });

      it('resetPoints invokes ResetPoints', async () => {
        await game.resetPoints();
        expect(mockInvoke).toHaveBeenCalledWith('ResetPoints');
      });

      it('tutorialProblem invokes TutorialProblem with payload', async () => {
        const payload = { step: 1 };
        await game.tutorialProblem(payload);
        expect(mockInvoke).toHaveBeenCalledWith('TutorialProblem', payload);
      });

      it('tutorialDone invokes TutorialDone with numTries', async () => {
        await game.tutorialDone(3);
        expect(mockInvoke).toHaveBeenCalledWith('TutorialDone', 3);
      });
    });

    describe('participant commands', () => {
      it('setParticipantName invokes SetParticipantName with name', async () => {
        await game.setParticipantName('Participant1');
        expect(mockInvoke).toHaveBeenCalledWith('SetParticipantName', 'Participant1');
      });

      it('getChimes invokes GetChimes', async () => {
        await game.getChimes();
        expect(mockInvoke).toHaveBeenCalledWith('GetChimes');
      });
    });

    describe('resolution commands', () => {
      it('setGameResolution invokes SetGameResolution with payload', async () => {
        const payload = { resolution: 'completed' };
        await game.setGameResolution(payload);
        expect(mockInvoke).toHaveBeenCalledWith('SetGameResolution', payload);
      });
    });

    describe('telemetry commands', () => {
      it('telemetryEvent invokes TelemetryEvent with payload', async () => {
        const payload = { event: 'click', target: 'button' };
        await game.telemetryEvent(payload);
        expect(mockInvoke).toHaveBeenCalledWith('TelemetryEvent', payload);
      });
    });
  });

  describe('exports', () => {
    it('exports connectionReady', () => {
      const game = require('../game');
      expect(game.connectionReady).toBeDefined();
    });
  });
});
