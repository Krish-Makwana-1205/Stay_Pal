import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import LogoutButton from './LogOut';
import axios from 'axios';

vi.mock('axios');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('LogoutButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render logout button', () => {
    renderWithRouter(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
  });

  it('should call logout API when clicked', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    const user = userEvent.setup();
    
    renderWithRouter(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    await user.click(button);
    
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8002/user/logout',
      {},
      { withCredentials: true }
    );
  });

  it('should handle logout error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error('Logout failed'));
    const user = userEvent.setup();
    
    renderWithRouter(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    await user.click(button);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('should have correct styling classes', () => {
    renderWithRouter(<LogoutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toHaveClass('bg-red-600', 'text-white', 'px-4', 'py-2', 'rounded');
  });
});
