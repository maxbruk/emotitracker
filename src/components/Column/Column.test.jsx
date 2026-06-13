import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';

describe('Column Component', () => {
  const mockOnAdd = vi.fn();
  const mockOnResolve = vi.fn();
  const items = [
    { id: '1', text: 'Item 1', type: 'trigger', status: 'active' },
    { id: '2', text: 'Item 2', type: 'trigger', status: 'active' }
  ];

  const renderWithDnd = (ui) => {
    return render(<DragDropContext onDragEnd={() => {}}>{ui}</DragDropContext>);
  };

  it('renders column with title and add input', () => {
    renderWithDnd(<Column id="col-1" title="Test Column" type="trigger" items={[]} onAdd={mockOnAdd} onResolve={mockOnResolve} />);
    expect(screen.getByText('Test Column')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Добавить...')).toBeInTheDocument();
  });

  it('calls onAdd with new item text when form is submitted', () => {
    renderWithDnd(<Column id="col-1" title="Радости" type="joy" items={[]} onAdd={mockOnAdd} onResolve={mockOnResolve} />);
    
    const input = screen.getByPlaceholderText('Добавить...');
    fireEvent.change(input, { target: { value: 'New Joy' } });
    
    const form = screen.getByTestId('add-form');
    fireEvent.submit(form);
    
    expect(mockOnAdd).toHaveBeenCalledWith('New Joy');
    expect(input.value).toBe(''); // Input should be cleared
  });

  it('renders list of items', () => {
    renderWithDnd(<Column id="col-1" title="Триггеры" type="trigger" items={items} onAdd={mockOnAdd} onResolve={mockOnResolve} />);
    
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
