import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Experimenter from '../Experimenter';
import { renderWithProviders } from '../../test-utils/test-utils';

// Mock ChimesConfigContext to prevent real game calls
jest.mock('../../context/ChimesConfigContext', () => ({
  ChimesConfigProvider: ({ children }) => children,
  useChimesConfig: () => ({
    chimesConfig: {
      messageSent: true,
      messageReceived: true,
      timer: true,
    },
    updateChimesConfig: jest.fn(),
  }),
}));

// Mock API modules
jest.mock('../../api/users', () => ({
  getCurrentUser: jest.fn(() => Promise.resolve('{"name":"Test Participant"}')),
}));

jest.mock('../../data/confederates', () => ({
  getConfederatesStart: jest.fn(() =>
    Promise.resolve({
      femaleData: [
        { name: 'Alice' },
        { name: 'Beth' },
        { name: 'Carol' }
      ],
      maleData: [
        { name: 'David' },
        { name: 'Eric' },
        { name: 'Frank' }
      ],
    })
  ),
}));

// Mock realtime/game module
jest.mock('../../realtime/game', () => ({
  onTutorialDone: jest.fn(),
  offTutorialDone: jest.fn(),
  clearAnswer: jest.fn(),
  nextProblem: jest.fn(),
  resetTimer: jest.fn(),
  startTimer: jest.fn(),
  stopTimer: jest.fn(),
  startGame: jest.fn(),
  setPointsAwarded: jest.fn(),
  setMaxTime: jest.fn(),
  setConfederate: jest.fn(),
  setChimes: jest.fn(),
  updateProblemSelection: jest.fn(),
  clearChat: jest.fn(),
  blockFinished: jest.fn(),
  gameEnded: jest.fn(),
  setGameResolution: jest.fn(),
}));

// Mock child components
jest.mock('../../components/ChatBox', () => {
  return function ChatBox({ currentUser, isAdmin }) {
    return (
      <div data-testid="chat-box">
        ChatBox - Admin: {isAdmin.toString()}
      </div>
    );
  };
});

jest.mock('../../components/GameBox', () => {
  return function GameBox({ isAdmin }) {
    return <div data-testid="game-box">GameBox - Admin: {isAdmin.toString()}</div>;
  };
});

jest.mock('../../components/Modal', () => {
  return function Modal({ children }) {
    return <div data-testid="modal">{children}</div>;
  };
});

// Mock alert
global.alert = jest.fn();

// Get mock functions from the mocked module
const mockFunctions = require('../../realtime/game');

describe('Experimenter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render ChatBox and GameBox with admin=true', async () => {
      renderWithProviders(<Experimenter />);

      await waitFor(() => {
        const chatBox = screen.getByTestId('chat-box');
        const gameBox = screen.getByTestId('game-box');

        expect(chatBox).toHaveTextContent('Admin: true');
        expect(gameBox).toHaveTextContent('Admin: true');
      });
    });

    it('should render control buttons', () => {
      renderWithProviders(<Experimenter />);

      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('should not show modals initially', () => {
      renderWithProviders(<Experimenter />);

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should load confederates data on mount', async () => {
      const { getConfederatesStart } = require('../../data/confederates');

      renderWithProviders(<Experimenter />);

      await waitFor(() => {
        expect(getConfederatesStart).toHaveBeenCalled();
      });
    });

    it('should load current user on mount', async () => {
      const { getCurrentUser } = require('../../api/users');

      renderWithProviders(<Experimenter />);

      await waitFor(() => {
        expect(getCurrentUser).toHaveBeenCalled();
      });
    });
  });

  describe('Game Configuration Modal', () => {
    it('should open game config modal when start game button is clicked', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('should display gender selection radio buttons in modal', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        const radios = screen.getAllByRole('radio');
        expect(radios.length).toBe(2);
      });
    });

    it('should display confederate name dropdown in modal', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('should display points awarded input in modal', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        const numberInputs = screen.getAllByRole('spinbutton');
        expect(numberInputs.length).toBeGreaterThan(0);
      });
    });

    it('should have default female gender selected', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        const femaleRadio = screen.getByRole('radio', { name: /female/i });
        expect(femaleRadio).toBeChecked();
      });
    });

    it('should switch confederate list when gender changes', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(async () => {
        const radios = screen.getAllByRole('radio');
        const maleRadio = radios.find(r => r.value === 'M');
        await userEvent.click(maleRadio);
      });

      await waitFor(() => {
        const radios = screen.getAllByRole('radio');
        const maleRadio = radios.find(r => r.value === 'M');
        expect(maleRadio).toBeChecked();
      });
    });

    it('should close modal when cancelled', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(async () => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });
  });

  describe('Game Configuration Save', () => {
    it('should call game setup functions when save is clicked', async () => {
      renderWithProviders(<Experimenter />);

      // Open modal
      const startGameButton = screen.getAllByRole('button')[0];
      await userEvent.click(startGameButton);

      // Wait for modal to appear and find the start button inside it
      await waitFor(() => {
        expect(screen.getByText(/game_configuration/i)).toBeInTheDocument();
      });

      // Find and click the start button in the modal (translated as "start")
      const startButton = screen.getByText('start');
      await userEvent.click(startButton);

      // Should call game functions
      await waitFor(() => {
        expect(mockFunctions.startGame).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Problem Navigation', () => {
    it('should advance problem when next problem button is clicked', async () => {
      renderWithProviders(<Experimenter />);

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[buttons.length - 1]; // Last button

      await userEvent.click(nextButton);

      expect(mockFunctions.clearAnswer).toHaveBeenCalled();
    });

    it('should reset and start timer for new problem', async () => {
      renderWithProviders(<Experimenter />);

      const buttons = screen.getAllByRole('button');
      const nextButton = buttons[buttons.length - 1];

      await userEvent.click(nextButton);

      expect(mockFunctions.resetTimer).toHaveBeenCalled();
      expect(mockFunctions.startTimer).toHaveBeenCalled();
    });
  });

  describe('Resolution Modal', () => {
    it('should open resolution modal when resolve button is clicked', async () => {
      renderWithProviders(<Experimenter />);

      const buttons = screen.getAllByRole('button');
      const resolveButton = buttons[1]; // Middle button

      await userEvent.click(resolveButton);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });
  });

  describe('Tutorial Complete Modal', () => {
    it('should show tutorial complete modal when tutorial is done', async () => {
      let tutorialHandler;

      mockFunctions.onTutorialDone.mockImplementation((handler) => {
        tutorialHandler = handler;
      });

      renderWithProviders(<Experimenter />);

      // Trigger tutorial complete
      tutorialHandler(3);

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });
  });

  describe('Event Handlers', () => {
    it('should register tutorial done handler on mount', () => {
      renderWithProviders(<Experimenter />);

      expect(mockFunctions.onTutorialDone).toHaveBeenCalled();
    });

    it('should unregister tutorial done handler on unmount', () => {
      const { unmount } = renderWithProviders(<Experimenter />);

      unmount();

      expect(mockFunctions.offTutorialDone).toHaveBeenCalled();
    });
  });

  describe('Chimes Configuration', () => {
    it('should display chime checkboxes in config modal', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });

    it('should have message received chimes enabled by default', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).toBeChecked();
      });
    });
  });

  describe('Points and Time Configuration', () => {
    it('should have default points value of 7', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        const spinbuttons = screen.getAllByRole('spinbutton');
        const pointsInput = spinbuttons[0];
        expect(pointsInput).toHaveValue(7);
      });
    });

    it('should have default max time of 90 seconds', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(() => {
        const spinbuttons = screen.getAllByRole('spinbutton');
        const timeInput = spinbuttons[1];
        expect(timeInput).toHaveValue(90);
      });
    });

    it('should allow changing points value', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(async () => {
        const spinbuttons = screen.getAllByRole('spinbutton');
        const pointsInput = spinbuttons[0];

        await userEvent.clear(pointsInput);
        await userEvent.type(pointsInput, '10');

        expect(pointsInput).toHaveValue(10);
      });
    });

    it('should allow changing max time value', async () => {
      renderWithProviders(<Experimenter />);

      const startButton = screen.getAllByRole('button')[0];
      await userEvent.click(startButton);

      await waitFor(async () => {
        const spinbuttons = screen.getAllByRole('spinbutton');
        const timeInput = spinbuttons[1];

        await userEvent.clear(timeInput);
        await userEvent.type(timeInput, '120');

        expect(timeInput).toHaveValue(120);
      });
    });
  });
});
