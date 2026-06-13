import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the main layout with columns and archive button', () => {
    render(<App />);
    expect(screen.getByText('Дискомфорт / Триггеры')).toBeInTheDocument();
    expect(screen.getByText('Радости / Удовольствие')).toBeInTheDocument();
    expect(screen.getAllByText('Архив').length).toBeGreaterThan(0);
  });

  it('adds a trigger', () => {
    render(<App />);
    const inputs = screen.getAllByPlaceholderText('Добавить...');
    const triggerInput = inputs[0]; // First input is for triggers
    
    fireEvent.change(triggerInput, { target: { value: 'Bad Weather' } });
    const forms = screen.getAllByTestId('add-form');
    fireEvent.submit(forms[0]);
    
    expect(screen.getByText('Bad Weather')).toBeInTheDocument();
  });

  it('adds a joy', () => {
    render(<App />);
    const inputs = screen.getAllByPlaceholderText('Добавить...');
    const joyInput = inputs[1]; // Second input is for joys
    
    fireEvent.change(joyInput, { target: { value: 'Good Coffee' } });
    const forms = screen.getAllByTestId('add-form');
    fireEvent.submit(forms[1]);
    
    expect(screen.getByText('Good Coffee')).toBeInTheDocument();
  });

  it('opens and closes archive', () => {
    render(<App />);
    
    // Check archive is closed initially
    const archivePanel = screen.getByTestId('archive-panel');
    expect(archivePanel).toHaveClass(/closed/i);

    // Open archive
    const archiveBtns = screen.getAllByText('Архив');
    fireEvent.click(archiveBtns[0]); // Click the button
    expect(archivePanel).toHaveClass(/panelOpen/i);

    // Close archive
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    expect(archivePanel).toHaveClass(/closed/i);
  });
});
