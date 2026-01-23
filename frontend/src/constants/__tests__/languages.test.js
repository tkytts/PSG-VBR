import languages from '../languages';

describe('languages', () => {
  it('exports an array of languages', () => {
    expect(Array.isArray(languages)).toBe(true);
  });

  it('contains Portuguese language option', () => {
    const portuguese = languages.find(lang => lang.value === 'pt');
    
    expect(portuguese).toBeDefined();
    expect(portuguese.label).toContain('Portugu');
    expect(portuguese.countryCode).toBe('BR');
  });

  it('contains English language option', () => {
    const english = languages.find(lang => lang.value === 'en');
    
    expect(english).toBeDefined();
    expect(english.label).toBe('English');
    expect(english.countryCode).toBe('US');
  });

  it('all language options have required properties', () => {
    languages.forEach(lang => {
      expect(lang).toHaveProperty('value');
      expect(lang).toHaveProperty('label');
      expect(lang).toHaveProperty('countryCode');
      expect(typeof lang.value).toBe('string');
      expect(typeof lang.label).toBe('string');
      expect(typeof lang.countryCode).toBe('string');
    });
  });

  it('Portuguese is the first language (default)', () => {
    expect(languages[0].value).toBe('pt');
  });

  it('contains at least 2 languages', () => {
    expect(languages.length).toBeGreaterThanOrEqual(2);
  });

  it('language values are unique', () => {
    const values = languages.map(lang => lang.value);
    const uniqueValues = [...new Set(values)];
    
    expect(values.length).toBe(uniqueValues.length);
  });
});
