import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Mock realtime/game module before imports
jest.mock('./realtime/game', () => ({
  connectionReady: Promise.resolve(),
  onChimesUpdated: jest.fn(),
  offChimesUpdated: jest.fn(),
  getChimes: jest.fn().mockResolvedValue(undefined),
  setChimes: jest.fn().mockResolvedValue(undefined),
}));

import App from './App';

// Mock the lazy-loaded pages
jest.mock('./pages/Experimenter', () => () => <div data-testid="experimenter-page">Experimenter Page</div>);
jest.mock('./pages/Participant', () => () => <div data-testid="participant-page">Participant Page</div>);
jest.mock('./pages/Tutorial', () => () => <div data-testid="tutorial-page">Tutorial Page</div>);

// Initialize test i18n instance
const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: {} },
    pt: { translation: {} },
  },
  interpolation: { escapeValue: false },
});

describe('App', () => {
  beforeEach(() => {
    // Reset font size before each test
    document.documentElement.style.fontSize = '';
  });

  it('renders font size controls', async () => {
    window.history.pushState({}, 'Test', '/tutorial');
    render(<App />);
    
    expect(screen.getByText('A+')).toBeInTheDocument();
    expect(screen.getByText('A-')).toBeInTheDocument();
  });

  it('renders language selector', async () => {
    window.history.pushState({}, 'Test', '/tutorial');
    render(<App />);
    
    // React-select renders the current language
    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  it('renders tutorial page on /tutorial route', async () => {
    window.history.pushState({}, 'Test', '/tutorial');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('tutorial-page')).toBeInTheDocument();
    });
  });

  it('renders experimenter page on /experimenter route', async () => {
    window.history.pushState({}, 'Test', '/experimenter');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('experimenter-page')).toBeInTheDocument();
    });
  });

  it('renders participant page on /participant route', async () => {
    window.history.pushState({}, 'Test', '/participant');
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('participant-page')).toBeInTheDocument();
    });
  });

  it('font size increase button works', async () => {
    window.history.pushState({}, 'Test', '/tutorial');
    render(<App />);
    
    const increaseButton = screen.getByText('A+');
    fireEvent.click(increaseButton);
    
    // The font size should be applied to documentElement
    // Default is 16, after click should be 18
    expect(document.documentElement.style.fontSize).toBe('18px');
  });

  it('font size decrease button works', async () => {
    window.history.pushState({}, 'Test', '/tutorial');
    render(<App />);
    
    // Reset to default
    document.documentElement.style.fontSize = '16px';
    
    const decreaseButton = screen.getByText('A-');
    fireEvent.click(decreaseButton);
    
    expect(document.documentElement.style.fontSize).toBe('14px');
  });
});
