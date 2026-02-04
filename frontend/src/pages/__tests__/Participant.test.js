import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Participant from '../Participant';
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

// Mock realtime/game module
const mockSetParticipantName = jest.fn();
const mockGetChimes = jest.fn();
const mockStartTimer = jest.fn();
const mockOnNewConfederate = jest.fn();
const mockOffNewConfederate = jest.fn();
const mockOnShowEndModal = jest.fn();
const mockOffShowEndModal = jest.fn();

jest.mock('../../realtime/game', () => ({
  setParticipantName: (...args) => mockSetParticipantName(...args),
  getChimes: (...args) => mockGetChimes(...args),
  startTimer: (...args) => mockStartTimer(...args),
  onNewConfederate: (...args) => mockOnNewConfederate(...args),
  offNewConfederate: (...args) => mockOffNewConfederate(...args),
  onShowEndModal: (...args) => mockOnShowEndModal(...args),
  offShowEndModal: (...args) => mockOffShowEndModal(...args),
}));

// Mock child components
jest.mock('../../components/ChatBox', () => {
  return function ChatBox({ currentUser, isAdmin }) {
    return (
      <div data-testid="chat-box">
        ChatBox - User: {currentUser}, Admin: {isAdmin.toString()}
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

describe('Participant Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render name input form initially', () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      const button = screen.getByRole('button');

      expect(input).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('should not render ChatBox and GameBox initially', () => {
      renderWithProviders(<Participant />);

      expect(screen.queryByTestId('chat-box')).not.toBeInTheDocument();
      expect(screen.queryByTestId('game-box')).not.toBeInTheDocument();
    });
  });

  describe('Name Input and Submission', () => {
    it('should update input value when typing', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');

      expect(input).toHaveValue('Test User');
    });

    it('should call setParticipantName when form is submitted with valid name', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      const button = screen.getByRole('button');

      await userEvent.type(input, 'Test User');
      await userEvent.click(button);

      expect(mockSetParticipantName).toHaveBeenCalledWith('Test User');
    });

    it('should not submit form when name is empty', async () => {
      renderWithProviders(<Participant />);

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(mockSetParticipantName).not.toHaveBeenCalled();
    });

    it('should not submit form when name contains only whitespace', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      const button = screen.getByRole('button');

      await userEvent.type(input, '   ');
      await userEvent.click(button);

      expect(mockSetParticipantName).not.toHaveBeenCalled();
    });

    it('should hide name form after successful submission', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      const button = screen.getByRole('button');

      await userEvent.type(input, 'Test User');
      await userEvent.click(button);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Your Name')).not.toBeInTheDocument();
      });
    });

    it('should submit form using Enter key', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User{Enter}');

      expect(mockSetParticipantName).toHaveBeenCalledWith('Test User');
    });
  });

  describe('Waiting for Confederate', () => {
    it('should render ChatBox and GameBox after name submission', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByTestId('chat-box')).toBeInTheDocument();
      });
      expect(screen.getByTestId('game-box')).toBeInTheDocument();
    });

    it('should pass correct props to ChatBox', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByTestId('chat-box')).toBeInTheDocument();
      });
      const chatBox = screen.getByTestId('chat-box');
      expect(chatBox).toHaveTextContent('User: Test User');
      expect(chatBox).toHaveTextContent('Admin: false');
    });

    it('should pass isAdmin=false to GameBox', async () => {
      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const gameBox = screen.getByTestId('game-box');
        expect(gameBox).toHaveTextContent('Admin: false');
      });
    });
  });

  describe('Confederate Assignment', () => {
    it('should show ready modal when confederate is assigned', async () => {
      let confederateHandler;

      mockOnNewConfederate.mockImplementation((handler) => {
        confederateHandler = handler;
      });

      renderWithProviders(<Participant />);

      // Submit name
      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      // Simulate confederate assignment
      confederateHandler('Confederate Alice');

      await waitFor(() => {
        expect(screen.getByText('Confederate Alice')).toBeInTheDocument();
      });
    });

    it('should display Ready button when confederate is assigned', async () => {
      let confederateHandler;

      mockOnNewConfederate.mockImplementation((handler) => {
        confederateHandler = handler;
      });

      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      confederateHandler('Confederate Bob');

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });
    });
  });

  describe('Ready Button', () => {
    it('should call getChimes and startTimer when ready button is clicked', async () => {
      let confederateHandler;

      mockOnNewConfederate.mockImplementation((handler) => {
        confederateHandler = handler;
      });

      renderWithProviders(<Participant />);

      // Submit name and assign confederate
      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      confederateHandler('Confederate Charlie');

      // Click ready button
      await waitFor(async () => {
        const buttons = screen.getAllByRole('button');
        const readyButton = buttons[buttons.length - 1];
        await userEvent.click(readyButton);
      });

      expect(mockGetChimes).toHaveBeenCalled();
      expect(mockStartTimer).toHaveBeenCalled();
    });

    it('should hide ready modal after clicking ready', async () => {
      let confederateHandler;

      mockOnNewConfederate.mockImplementation((handler) => {
        confederateHandler = handler;
      });

      renderWithProviders(<Participant />);

      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      confederateHandler('Confederate Dave');

      const confederateName = await screen.findByText('Confederate Dave');
      expect(confederateName).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      const readyButton = buttons[buttons.length - 1];
      await userEvent.click(readyButton);

      await waitFor(() => {
        expect(screen.queryByText('Confederate Dave')).not.toBeInTheDocument();
      });
    });
  });

  describe('Game Ended Modal', () => {
    it('should show game ended modal when triggered', async () => {
      let endModalHandler;

      mockOnShowEndModal.mockImplementation((handler) => {
        endModalHandler = handler;
      });

      renderWithProviders(<Participant />);

      // Trigger game end
      endModalHandler();

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });

    it('should use Modal component for game ended modal', async () => {
      let endModalHandler;

      mockOnShowEndModal.mockImplementation((handler) => {
        endModalHandler = handler;
      });

      renderWithProviders(<Participant />);

      endModalHandler();

      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument();
      });
    });
  });

  describe('Event Handler Registration', () => {
    it('should register confederate event handler on mount', () => {
      renderWithProviders(<Participant />);
      expect(mockOnNewConfederate).toHaveBeenCalled();
    });

    it('should register show end modal event handler on mount', () => {
      renderWithProviders(<Participant />);
      expect(mockOnShowEndModal).toHaveBeenCalled();
    });

    it('should unregister event handlers on unmount', () => {
      const { unmount } = renderWithProviders(<Participant />);

      unmount();

      expect(mockOffNewConfederate).toHaveBeenCalled();
      expect(mockOffShowEndModal).toHaveBeenCalled();
    });
  });

  describe('Confederate Reassignment', () => {
    it('should reset ready state when new confederate is assigned', async () => {
      let confederateHandler;

      mockOnNewConfederate.mockImplementation((handler) => {
        confederateHandler = handler;
      });

      renderWithProviders(<Participant />);

      // Submit name
      const input = screen.getByPlaceholderText('Your Name');
      await userEvent.type(input, 'Test User');
      await userEvent.click(screen.getByRole('button'));

      // First confederate
      confederateHandler('First Confederate');

      await waitFor(() => {
        expect(screen.getByText('First Confederate')).toBeInTheDocument();
      });

      // Click ready
      const buttons1 = screen.getAllByRole('button');
      await userEvent.click(buttons1[buttons1.length - 1]);

      // New confederate assigned
      confederateHandler('Second Confederate');

      // Should show ready modal again
      await waitFor(() => {
        expect(screen.getByText('Second Confederate')).toBeInTheDocument();
      });
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });
  });
});
