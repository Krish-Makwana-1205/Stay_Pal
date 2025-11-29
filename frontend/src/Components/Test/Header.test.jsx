import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header Component', () => {
  const mockUser = {
    username: 'John Doe',
    email: 'john@example.com',
    profilePhoto: 'https://example.com/photo.jpg',
  };

  const mockProps = {
    user: mockUser,
    onNavigate: vi.fn(),
    onLogout: vi.fn(),
    active: 'properties',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header with user information', () => {
    render(<Header {...mockProps} />);
    
    expect(screen.getByText('Stay Pal')).toBeInTheDocument();
    expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
  });

  it('should display default username when user has no username', () => {
    const userWithoutName = { ...mockUser, username: null };
    
    render(<Header {...mockProps} user={userWithoutName} />);
    
    expect(screen.getByText('Welcome, User')).toBeInTheDocument();
  });

  it('should render all navigation buttons', () => {
    render(<Header {...mockProps} />);
    
    expect(screen.getByText('Search Properties')).toBeInTheDocument();
    expect(screen.getByText('Search Roommates')).toBeInTheDocument();
    expect(screen.getByText('Predict Rent')).toBeInTheDocument();
    expect(screen.getByText('Near You')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should call onNavigate when Search Properties is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const button = screen.getByText('Search Properties');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/dashboard/properties');
  });

  it('should call onNavigate when Search Roommates is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const button = screen.getByText('Search Roommates');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/dashboard/roommates');
  });

  it('should call onNavigate when Predict Rent is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const button = screen.getByText('Predict Rent');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/predict-rent');
  });

  it('should call onNavigate when Near You is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const button = screen.getByText('Near You');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/nearest-properties');
  });

  it('should call onNavigate when Home is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const button = screen.getByText('Home');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should highlight active button', () => {
    render(<Header {...mockProps} active="properties" />);
    
    const button = screen.getByText('Search Properties');
    expect(button).toHaveClass('active');
  });

  it('should highlight home button when active', () => {
    render(<Header {...mockProps} active="home" />);
    
    const button = screen.getByText('Home');
    expect(button).toHaveClass('active');
  });

  it('should display user profile photo', () => {
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    expect(profileImg).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('should display default profile photo when not provided', () => {
    const userWithoutPhoto = { ...mockUser, profilePhoto: null };
    
    render(<Header {...mockProps} user={userWithoutPhoto} />);
    
    const profileImg = screen.getByAltText('profile');
    expect(profileImg).toHaveAttribute('src', '/profile-pic.jpg');
  });

  it('should toggle dropdown when profile photo is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    await user.click(profileImg);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should render all dropdown menu items', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Your Properties')).toBeInTheDocument();
    expect(screen.getByText('Applied Properties')).toBeInTheDocument();
    expect(screen.getByText('Add Property')).toBeInTheDocument();
    expect(screen.getByText('List as Roommate')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should navigate to profile when Profile is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    const profileButton = screen.getByText('Profile');
    await user.click(profileButton);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/profile');
  });

  it('should navigate to properties when Your Properties is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    const button = screen.getByText('Your Properties');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/myproperties');
  });

  it('should navigate to applications when Applied Properties is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    const button = screen.getByText('Applied Properties');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/tenant/my-applications');
  });

  it('should navigate to property form when Add Property is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    const button = screen.getByText('Add Property');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/propertyForm');
  });

  it('should navigate to roommate form when List as Roommate is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    const button = screen.getByText('List as Roommate');
    await user.click(button);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/roommateForm');
  });

  it('should call onLogout when Logout is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);
    
    expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
  });

  it('should close dropdown after navigation', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    
    const profileButton = screen.getByText('Profile');
    await user.click(profileButton);
    
    expect(screen.queryByText('Your Properties')).not.toBeInTheDocument();
  });

  it('should close dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const profileImg = screen.getByAltText('profile');
    await user.click(profileImg);
    
    expect(screen.getByText('Profile')).toBeInTheDocument();
    
    await user.click(document.body);
    
    expect(screen.queryByText('Your Properties')).not.toBeInTheDocument();
  });

  it('should navigate to chat when chat button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header {...mockProps} />);
    
    const buttons = screen.getAllByRole('button');
    const chatButton = buttons.find(btn => btn.querySelector('svg'));
    
    await user.click(chatButton);
    
    expect(mockProps.onNavigate).toHaveBeenCalledWith('/my-chats');
  });
});
