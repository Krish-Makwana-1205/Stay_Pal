import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocalitySelector from './LocalitySelector';

global.fetch = vi.fn();

describe('LocalitySelector Component', () => {
  const mockLocalitiesResponse = {
    postalCodes: [
      { placeName: 'Andheri', postalCode: '400053' },
      { placeName: 'Bandra', postalCode: '400050' },
      { placeName: 'Andheri', postalCode: '400058' }, // Duplicate
      { placeName: 'Juhu', postalCode: '400049' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render disabled when no city is selected', () => {
    render(<LocalitySelector city="" value="" onChange={vi.fn()} />);
    
    const select = screen.getByText('Select city first');
    expect(select).toBeInTheDocument();
  });

  it('should fetch localities when city is provided', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockLocalitiesResponse,
    });

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('Mumbai')
      );
    });
  });

  it('should cache localities in localStorage', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockLocalitiesResponse,
    });

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      const cached = localStorage.getItem('localities_Mumbai');
      expect(cached).toBeTruthy();
    });
  });

  it('should use cached localities if available', async () => {
    const cachedData = [
      { locality: 'Andheri', postalCode: '400053' },
      { locality: 'Bandra', postalCode: '400050' },
    ];
    
    localStorage.setItem('localities_Mumbai', JSON.stringify(cachedData));

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  it('should remove duplicate localities', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => mockLocalitiesResponse,
    });

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      const cached = localStorage.getItem('localities_Mumbai');
      const parsed = JSON.parse(cached);
      const andheriCount = parsed.filter(l => l.locality === 'Andheri').length;
      expect(andheriCount).toBe(1);
    });
  });

  it('should call onChange when locality is selected', async () => {
    const cachedData = [
      { locality: 'Andheri', postalCode: '400053' },
      { locality: 'Bandra', postalCode: '400050' },
    ];
    
    localStorage.setItem('localities_Mumbai', JSON.stringify(cachedData));

    const onChange = vi.fn();
    const user = userEvent.setup();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Select locality')).toBeInTheDocument();
    });
  });

  it('should display selected value', async () => {
    const cachedData = [
      { locality: 'Andheri', postalCode: '400053' },
    ];
    
    localStorage.setItem('localities_Mumbai', JSON.stringify(cachedData));

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="Andheri" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Andheri')).toBeInTheDocument();
    });
  });

  it('should handle fetch error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching locality:', expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });

  it('should show fetching message overlay', async () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Fetching localities…')).toBeInTheDocument();
    });
  });

  it('should clear locality when city changes', async () => {
    const onChange = vi.fn();
    
    const { rerender } = render(<LocalitySelector city="Mumbai" value="Andheri" onChange={onChange} />);
    
    rerender(<LocalitySelector city="" value="Andheri" onChange={onChange} />);
    
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  it('should call onChange with empty string when cleared', async () => {
    const cachedData = [
      { locality: 'Andheri', postalCode: '400053' },
    ];
    
    localStorage.setItem('localities_Mumbai', JSON.stringify(cachedData));

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="Andheri" onChange={onChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Andheri')).toBeInTheDocument();
    });
  });

  it('should be disabled while fetching', async () => {
    fetch.mockImplementation(() => new Promise(() => {}));

    const onChange = vi.fn();
    
    render(<LocalitySelector city="Mumbai" value="" onChange={onChange} />);
    
    await waitFor(() => {
      const overlay = screen.getByText('Fetching localities…');
      expect(overlay).toBeInTheDocument();
    });
  });
});
