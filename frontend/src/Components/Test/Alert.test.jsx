import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from './Alert';

describe('Alert Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when message is null', () => {
    const { container } = render(<Alert message={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when message is empty', () => {
    const { container } = render(<Alert message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render success alert with correct styling', () => {
    render(<Alert message="Success message" type="success" />);
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
    
    const alert = screen.getByText('Success message').closest('.alert-toast');
    expect(alert).toHaveClass('alert-success');
  });

  it('should render error alert with correct styling', () => {
    render(<Alert message="Error message" type="error" />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    
    const alert = screen.getByText('Error message').closest('.alert-toast');
    expect(alert).toHaveClass('alert-error');
  });

  it('should render info alert by default', () => {
    render(<Alert message="Info message" />);
    
    expect(screen.getByText('Notice')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
    
    const alert = screen.getByText('Info message').closest('.alert-toast');
    expect(alert).toHaveClass('alert-info');
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    
    render(<Alert message="Test message" onClose={onClose} autoClose={false} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-close after specified duration', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Alert message="Test message" onClose={onClose} autoClose={3000} />);
    
    expect(onClose).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(3000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it('should not auto-close when autoClose is false', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Alert message="Test message" onClose={onClose} autoClose={false} />);
    
    vi.advanceTimersByTime(10000);
    
    expect(onClose).not.toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('should pause auto-close on mouse enter', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Alert message="Test message" onClose={onClose} autoClose={3000} />);
    
    const alert = screen.getByText('Test message').closest('.alert-toast');
    
    vi.advanceTimersByTime(1000);
    
    fireEvent.mouseEnter(alert);
    
    expect(alert).toHaveClass('paused');
    
    vi.advanceTimersByTime(5000);
    
    expect(onClose).not.toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('should resume auto-close on mouse leave', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Alert message="Test message" onClose={onClose} autoClose={3000} />);
    
    const alert = screen.getByText('Test message').closest('.alert-toast');
    
    vi.advanceTimersByTime(1000);
    fireEvent.mouseEnter(alert);
    
    vi.advanceTimersByTime(500);
    fireEvent.mouseLeave(alert);
    
    vi.advanceTimersByTime(2000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it('should clean up event listeners on unmount', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<Alert message="Test message" onClose={onClose} autoClose={3000} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    vi.useRealTimers();
  });

  it('should handle invalid autoClose value', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Alert message="Test message" onClose={onClose} autoClose="invalid" />);
    
    vi.advanceTimersByTime(10000);
    
    expect(onClose).not.toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('should set progress duration CSS variable', () => {
    render(<Alert message="Test message" autoClose={5000} />);
    
    const alert = screen.getByText('Test message').closest('.alert-toast');
    expect(alert).toHaveStyle({ '--progress-duration': '5000ms' });
  });

  it('should display correct title for each alert type', () => {
    const { rerender } = render(<Alert message="Test" type="success" />);
    expect(screen.getByText('Success')).toBeInTheDocument();
    
    rerender(<Alert message="Test" type="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    
    rerender(<Alert message="Test" type="info" />);
    expect(screen.getByText('Notice')).toBeInTheDocument();
  });

  it('should render progress bar', () => {
    render(<Alert message="Test message" autoClose={5000} />);
    
    const progressBar = document.querySelector('.alert-progress');
    expect(progressBar).toBeInTheDocument();
  });
});
