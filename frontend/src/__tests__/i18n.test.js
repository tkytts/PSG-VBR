describe('i18n module', () => {
  let mockUse;
  let mockInit;
  let mockLocalStorage;

  beforeEach(() => {
    jest.resetModules();

    // Setup fresh mocks for each test
    mockUse = jest.fn().mockReturnThis();
    mockInit = jest.fn().mockReturnThis();

    // Mock localStorage
    mockLocalStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(key => mockLocalStorage[key] || null),
        setItem: jest.fn((key, value) => { mockLocalStorage[key] = value; }),
        removeItem: jest.fn(key => { delete mockLocalStorage[key]; })
      },
      writable: true
    });

    // Mock i18next with doMock (works with resetModules)
    jest.doMock('i18next', () => ({
      __esModule: true,
      default: {
        use: mockUse,
        init: mockInit
      }
    }));

    // Mock react-i18next
    jest.doMock('react-i18next', () => ({
      initReactI18next: { type: '3rdParty', init: jest.fn() }
    }));

    // Mock translation files
    jest.doMock('../locales/en/translation.json', () => ({ welcome: 'Welcome' }), { virtual: true });
    jest.doMock('../locales/pt/translation.json', () => ({ welcome: 'Bem-vindo' }), { virtual: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses react-i18next plugin', () => {
    require('../i18n');

    expect(mockUse).toHaveBeenCalled();
  });

  it('initializes with saved language from localStorage', () => {
    mockLocalStorage.language = 'en';

    require('../i18n');

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: 'en'
      })
    );
  });

  it('defaults to Portuguese when no saved language', () => {
    require('../i18n');

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        lng: 'pt'
      })
    );
  });

  it('sets English as fallback language', () => {
    require('../i18n');

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackLng: 'en'
      })
    );
  });

  it('configures interpolation with escapeValue false', () => {
    require('../i18n');

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        interpolation: { escapeValue: false }
      })
    );
  });

  it('includes English and Portuguese translations', () => {
    require('../i18n');

    expect(mockInit).toHaveBeenCalledWith(
      expect.objectContaining({
        resources: {
          en: { translation: expect.any(Object) },
          pt: { translation: expect.any(Object) }
        }
      })
    );
  });

  it('exports i18n instance', () => {
    const i18n = require('../i18n').default;

    expect(i18n).toBeDefined();
    expect(i18n.use).toBeDefined();
    expect(i18n.init).toBeDefined();
  });
});
