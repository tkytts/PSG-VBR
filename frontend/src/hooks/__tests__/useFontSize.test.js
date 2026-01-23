import { renderHook, act } from '@testing-library/react';
import { useFontSize } from '../useFontSize';

describe('useFontSize', () => {
  beforeEach(() => {
    // Reset document font size before each test
    document.documentElement.style.fontSize = '';
  });

  it('returns initial font size of 16 by default', () => {
    const { result } = renderHook(() => useFontSize());
    
    expect(result.current.fontSize).toBe(16);
  });

  it('accepts custom initial font size', () => {
    const { result } = renderHook(() => useFontSize(20));
    
    expect(result.current.fontSize).toBe(20);
  });

  it('increases font size by 2 when increaseFontSize is called', () => {
    const { result } = renderHook(() => useFontSize());
    
    act(() => {
      result.current.increaseFontSize();
    });
    
    expect(result.current.fontSize).toBe(18);
  });

  it('decreases font size by 2 when decreaseFontSize is called', () => {
    const { result } = renderHook(() => useFontSize());
    
    act(() => {
      result.current.decreaseFontSize();
    });
    
    expect(result.current.fontSize).toBe(14);
  });

  it('does not increase font size beyond 24', () => {
    const { result } = renderHook(() => useFontSize(24));
    
    act(() => {
      result.current.increaseFontSize();
    });
    
    expect(result.current.fontSize).toBe(24);
  });

  it('does not decrease font size below 12', () => {
    const { result } = renderHook(() => useFontSize(12));
    
    act(() => {
      result.current.decreaseFontSize();
    });
    
    expect(result.current.fontSize).toBe(12);
  });

  it('updates document root font size on increase', () => {
    const { result } = renderHook(() => useFontSize());
    
    act(() => {
      result.current.increaseFontSize();
    });
    
    expect(document.documentElement.style.fontSize).toBe('18px');
  });

  it('updates document root font size on decrease', () => {
    const { result } = renderHook(() => useFontSize());
    
    act(() => {
      result.current.decreaseFontSize();
    });
    
    expect(document.documentElement.style.fontSize).toBe('14px');
  });

  it('can be increased multiple times', () => {
    const { result } = renderHook(() => useFontSize());
    
    act(() => {
      result.current.increaseFontSize();
    });
    act(() => {
      result.current.increaseFontSize();
    });
    act(() => {
      result.current.increaseFontSize();
    });
    
    expect(result.current.fontSize).toBe(22);
  });

  it('can be decreased multiple times', () => {
    const { result } = renderHook(() => useFontSize(20));
    
    act(() => {
      result.current.decreaseFontSize();
    });
    act(() => {
      result.current.decreaseFontSize();
    });
    act(() => {
      result.current.decreaseFontSize();
    });
    
    expect(result.current.fontSize).toBe(14);
  });
});
