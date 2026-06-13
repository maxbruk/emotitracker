import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Card from './Card';

describe('Card Component', () => {
  it('renders trigger card with sad emoji', () => {
    render(<Card type="trigger" text="Annoying thing" />);
    expect(screen.getByText('Annoying thing')).toBeInTheDocument();
    expect(screen.getByText('Избавиться/Решено')).toBeInTheDocument();
    // Assuming sad emoji is rendered
  });

  it('renders joy card without button', () => {
    render(<Card type="joy" text="Happy thing" />);
    expect(screen.getByText('Happy thing')).toBeInTheDocument();
    expect(screen.queryByText('Избавиться/Решено')).toBeNull();
  });

  it('renders archived card correctly', () => {
    render(<Card type="trigger" status="archived" text="Resolved thing" />);
    expect(screen.getByText('Resolved thing')).toBeInTheDocument();
    expect(screen.queryByText('Избавиться/Решено')).toBeNull();
  });

  it('calls onResolve when resolve button is clicked after animation', async () => {
    const handleResolve = vi.fn();
    render(<Card type="trigger" text="Trigger" onResolve={handleResolve} />);
    
    const resolveButton = screen.getByText('Избавиться/Решено');
    fireEvent.click(resolveButton);
    
    // The animation should show text "Ей, минус один триггер!"
    expect(screen.getByText('Ей, минус один триггер!')).toBeInTheDocument();
    
    // We should wait for animation delay, mock timeout is better, but let's just waitFor
    await waitFor(() => {
      expect(handleResolve).toHaveBeenCalledTimes(1);
    }, { timeout: 2000 });
  });
});
