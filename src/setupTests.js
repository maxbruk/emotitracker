import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('canvas-confetti', () => {
  return {
    default: vi.fn()
  };
});
