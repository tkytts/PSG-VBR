import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider , initReactI18next } from 'react-i18next';
import i18n from 'i18next';

import LanguageSelector from '../LanguageSelector';

// Initialize test i18n instance
// eslint-disable-next-line import/no-named-as-default-member
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

const renderLanguageSelector = () => {
  return render(
    <I18nextProvider i18n={testI18n}>
      <BrowserRouter>
        <LanguageSelector />
      </BrowserRouter>
    </I18nextProvider>
  );
};

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.clear();
    testI18n.changeLanguage('en');
  });

  it('renders the language selector', () => {
    renderLanguageSelector();
    
    // React-select renders the current value
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('renders with correct initial language from i18n', () => {
    testI18n.changeLanguage('pt');
    renderLanguageSelector();
    
    // Use regex to match Portuguese regardless of encoding
    expect(screen.getByText(/Portugu/)).toBeInTheDocument();
  });

  it('displays country flags via ReactCountryFlag', () => {
    renderLanguageSelector();

    // ReactCountryFlag renders svg flags along with the language text
    expect(screen.getByText('English')).toBeInTheDocument();
  });
});
