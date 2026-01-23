import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Modal from '../Modal';

// Initialize test i18n instance
const testI18n = i18n.createInstance();
testI18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: { close: 'Close' } },
  },
  interpolation: { escapeValue: false },
});

const renderModal = (props) => {
  return render(
    <I18nextProvider i18n={testI18n}>
      <Modal {...props} />
    </I18nextProvider>
  );
};

describe('Modal', () => {
  it('renders children content', () => {
    renderModal({ children: <p>Modal content</p> });
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders close button when onClose is provided', () => {
    const onClose = jest.fn();
    renderModal({ 
      children: <p>Modal content</p>,
      onClose 
    });
    
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('does not render close button when onClose is not provided', () => {
    renderModal({ children: <p>Modal content</p> });
    
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    
    renderModal({
      children: <p>Modal content</p>,
      onClose
    });
    
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has proper modal styling (overlay)', () => {
    renderModal({ children: <p>Modal content</p> });
    
    const modal = screen.getByText('Modal content').closest('.modal');
    expect(modal).toHaveStyle({
      position: 'fixed',
      top: '0',
      left: '0',
    });
  });
});
