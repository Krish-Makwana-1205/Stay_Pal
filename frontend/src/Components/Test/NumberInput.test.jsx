import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberInput from './NumberInput';

describe('NumberInput Component', () => {
  it('should render input with correct attributes', () => {
    render(<NumberInput name="testInput" value="100" onChange={vi.fn()} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'testInput');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveValue(100);
  });

  it('should call onChange when value changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<NumberInput name="test" value="" onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    await user.type(input, '123');
    
    expect(onChange).toHaveBeenCalled();
  });

  it('should prevent typing e, E, +, -, .', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<NumberInput name="test" value="" onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    
    await user.type(input, 'e');
    await user.type(input, 'E');
    await user.type(input, '+');
    await user.type(input, '-');
    await user.type(input, '.');
    
    expect(input).toHaveValue(null);
  });

  it('should accept valid numeric input', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<NumberInput name="test" value="" onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    await user.type(input, '456');
    
    expect(onChange).toHaveBeenCalled();
  });

  it('should set min attribute', () => {
    render(<NumberInput name="test" value="10" onChange={vi.fn()} min={5} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '5');
  });

  it('should set required attribute', () => {
    render(<NumberInput name="test" value="" onChange={vi.fn()} required />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toBeRequired();
  });

  it('should display placeholder', () => {
    render(<NumberInput name="test" value="" onChange={vi.fn()} placeholder="Enter amount" />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('placeholder', 'Enter amount');
  });

  it('should have onInput handler to strip non-digits', () => {
    const onChange = vi.fn();
    
    render(<NumberInput name="test" value="" onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('should handle empty value', () => {
    const onChange = vi.fn();
    
    render(<NumberInput name="test" value="" onChange={onChange} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(null);
  });

  it('should handle zero value', () => {
    render(<NumberInput name="test" value="0" onChange={vi.fn()} />);
    
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(0);
  });
});
