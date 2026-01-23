import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FontSizeControls from '../FontSizeControls';

describe('FontSizeControls', () => {
  it('renders increase and decrease buttons', () => {
    render(
      <FontSizeControls onIncrease={jest.fn()} onDecrease={jest.fn()} />
    );
    
    expect(screen.getByText('A+')).toBeInTheDocument();
    expect(screen.getByText('A-')).toBeInTheDocument();
  });

  it('calls onIncrease when A+ button is clicked', () => {
    const onIncrease = jest.fn();
    const onDecrease = jest.fn();
    
    render(
      <FontSizeControls onIncrease={onIncrease} onDecrease={onDecrease} />
    );
    
    fireEvent.click(screen.getByText('A+'));
    
    expect(onIncrease).toHaveBeenCalledTimes(1);
    expect(onDecrease).not.toHaveBeenCalled();
  });

  it('calls onDecrease when A- button is clicked', () => {
    const onIncrease = jest.fn();
    const onDecrease = jest.fn();
    
    render(
      <FontSizeControls onIncrease={onIncrease} onDecrease={onDecrease} />
    );
    
    fireEvent.click(screen.getByText('A-'));
    
    expect(onDecrease).toHaveBeenCalledTimes(1);
    expect(onIncrease).not.toHaveBeenCalled();
  });

  it('has proper button classes', () => {
    render(
      <FontSizeControls onIncrease={jest.fn()} onDecrease={jest.fn()} />
    );
    
    expect(screen.getByText('A+')).toHaveClass('btn', 'btn-primary');
    expect(screen.getByText('A-')).toHaveClass('btn', 'btn-secondary');
  });
});
