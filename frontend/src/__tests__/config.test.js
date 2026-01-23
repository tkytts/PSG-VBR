describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('uses default API URL when env var is not set', () => {
    delete process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_HUB_URL;
    
    const config = require('../config').default;
    
    expect(config.serverUrl).toBe('/api');
  });

  it('uses default hub URL based on API URL when env var is not set', () => {
    delete process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_HUB_URL;
    
    const config = require('../config').default;
    
    expect(config.hubUrl).toBe('/api/gamehub');
  });

  it('uses REACT_APP_API_URL when set', () => {
    process.env.REACT_APP_API_URL = 'http://localhost:5000/api';
    
    const config = require('../config').default;
    
    expect(config.serverUrl).toBe('http://localhost:5000/api');
  });

  it('uses REACT_APP_HUB_URL when set', () => {
    process.env.REACT_APP_HUB_URL = 'http://localhost:5000/hub';
    
    const config = require('../config').default;
    
    expect(config.hubUrl).toBe('http://localhost:5000/hub');
  });

  it('derives hub URL from API URL when only API URL is set', () => {
    process.env.REACT_APP_API_URL = 'http://custom-server/api';
    delete process.env.REACT_APP_HUB_URL;
    
    const config = require('../config').default;
    
    expect(config.hubUrl).toBe('http://custom-server/api/gamehub');
  });

  it('exports serverUrl and hubUrl properties', () => {
    const config = require('../config').default;
    
    expect(config).toHaveProperty('serverUrl');
    expect(config).toHaveProperty('hubUrl');
  });
});
