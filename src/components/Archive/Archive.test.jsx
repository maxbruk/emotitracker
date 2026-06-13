import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Archive from './Archive';

describe('Archive Component', () => {
  it('renders correctly when open', () => {
    const items = [{ id: '1', text: 'Resolved Trigger', type: 'trigger', status: 'archived' }];
    render(<Archive isOpen={true} onClose={() => {}} items={items} />);
    
    expect(screen.getByText('Архив')).toBeInTheDocument();
    expect(screen.getByText('Resolved Trigger')).toBeInTheDocument();
  });

  it('renders correctly when closed (not visible)', () => {
    render(<Archive isOpen={false} onClose={() => {}} items={[]} />);
    const panel = screen.getByTestId('archive-panel');
    expect(panel).toHaveClass(/closed/i); // Assuming we use a CSS module class for closed state
  });
});
