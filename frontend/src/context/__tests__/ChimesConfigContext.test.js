import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ChimesConfigProvider, useChimesConfig } from '../ChimesConfigContext';

// Mock the realtime/game module
jest.mock('../../realtime/game', () => ({
  connectionReady: Promise.resolve(),
  onChimesUpdated: jest.fn(),
  offChimesUpdated: jest.fn(),
  getChimes: jest.fn().mockResolvedValue(undefined),
  setChimes: jest.fn().mockResolvedValue(undefined),
}));

// Import after mocking
import * as gameModule from '../../realtime/game';

// Test component that uses the context
const TestConsumer = () => {
  const { chimesConfig, updateChimesConfig } = useChimesConfig();
  
  return (
    <div>
      <span data-testid="messageSent">{String(chimesConfig.messageSent)}</span>
      <span data-testid="messageReceived">{String(chimesConfig.messageReceived)}</span>
      <span data-testid="timer">{String(chimesConfig.timer)}</span>
      <button onClick={() => updateChimesConfig({ ...chimesConfig, timer: false })}>
        Disable Timer
      </button>
    </div>
  );
};

describe('ChimesConfigContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides default chimes config', async () => {
    render(
      <ChimesConfigProvider>
        <TestConsumer />
      </ChimesConfigProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('messageSent')).toHaveTextContent('true');
      expect(screen.getByTestId('messageReceived')).toHaveTextContent('true');
      expect(screen.getByTestId('timer')).toHaveTextContent('true');
    });
  });

  it('registers chimes update handler on mount', async () => {
    render(
      <ChimesConfigProvider>
        <TestConsumer />
      </ChimesConfigProvider>
    );
    
    await waitFor(() => {
      expect(gameModule.onChimesUpdated).toHaveBeenCalled();
    });
  });

  it('requests chimes from server on mount', async () => {
    render(
      <ChimesConfigProvider>
        <TestConsumer />
      </ChimesConfigProvider>
    );
    
    await waitFor(() => {
      expect(gameModule.getChimes).toHaveBeenCalled();
    });
  });

  it('unregisters handler on unmount', async () => {
    const { unmount } = render(
      <ChimesConfigProvider>
        <TestConsumer />
      </ChimesConfigProvider>
    );
    
    // Wait for effects to run
    await waitFor(() => {
      expect(gameModule.onChimesUpdated).toHaveBeenCalled();
    });
    
    unmount();
    
    expect(gameModule.offChimesUpdated).toHaveBeenCalled();
  });
});

describe('useChimesConfig outside provider', () => {
  it('returns default values when used outside provider', () => {
    // Using the hook outside provider should return defaults
    const OutsideConsumer = () => {
      const result = useChimesConfig();
      return (
        <div>
          <span data-testid="hasConfig">{result ? 'yes' : 'no'}</span>
        </div>
      );
    };
    
    render(<OutsideConsumer />);
    
    expect(screen.getByTestId('hasConfig')).toHaveTextContent('yes');
  });
});
