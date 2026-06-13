import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return the initial value if local storage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return the value from local storage if it exists', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update local storage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new value'));
  });

  it('should handle complex objects', () => {
    const initialObj = { a: 1, b: 2 };
    const { result } = renderHook(() => useLocalStorage('test-key', initialObj));
    
    act(() => {
      result.current[1]({ a: 1, b: 3 });
    });

    expect(result.current[0]).toEqual({ a: 1, b: 3 });
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify({ a: 1, b: 3 }));
  });
});
