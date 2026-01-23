import { RESOLUTION_TYPES } from '../resolutionTypes';

describe('RESOLUTION_TYPES', () => {
  it('exports AP resolution type', () => {
    expect(RESOLUTION_TYPES.AP).toBe('AP');
  });

  it('exports ANP resolution type', () => {
    expect(RESOLUTION_TYPES.ANP).toBe('ANP');
  });

  it('exports DP resolution type', () => {
    expect(RESOLUTION_TYPES.DP).toBe('DP');
  });

  it('exports DNP resolution type', () => {
    expect(RESOLUTION_TYPES.DNP).toBe('DNP');
  });

  it('exports TNP resolution type', () => {
    expect(RESOLUTION_TYPES.TNP).toBe('TNP');
  });

  it('contains exactly 5 resolution types', () => {
    expect(Object.keys(RESOLUTION_TYPES)).toHaveLength(5);
  });

  it('all values are strings', () => {
    Object.values(RESOLUTION_TYPES).forEach(value => {
      expect(typeof value).toBe('string');
    });
  });
});
