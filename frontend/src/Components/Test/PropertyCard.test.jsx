import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyCard from './PropertyCard';

describe('PropertyCard Component', () => {
  const mockProperty = {
    _id: '1',
    name: 'Luxury Apartment',
    city: 'Mumbai',
    BHK: '3',
    rent: 25000,
    imgLink: ['https://example.com/image.jpg'],
    addressLink: 'https://maps.google.com/location',
  };

  it('should render property details correctly', () => {
    const onClick = vi.fn();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
    expect(screen.getByText('Mumbai — 3 BHK')).toBeInTheDocument();
    expect(screen.getByText('Rent: ₹25000')).toBeInTheDocument();
  });

  it('should display property image when available', () => {
    const onClick = vi.fn();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const image = screen.getByAltText('Mumbai');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('should display placeholder when no image available', () => {
    const propertyWithoutImage = { ...mockProperty, imgLink: [] };
    const onClick = vi.fn();
    
    render(<PropertyCard property={propertyWithoutImage} onClick={onClick} />);
    
    const placeholder = document.querySelector('.property-img-placeholder');
    expect(placeholder).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const card = document.querySelector('.property-card');
    await user.click(card);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Enter key is pressed', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const card = document.querySelector('.property-card');
    card.focus();
    await user.keyboard('{Enter}');
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should open location in new tab when location icon is clicked', async () => {
    const onClick = vi.fn();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const locationIcon = screen.getByAltText('Open location');
    await user.click(locationIcon);
    
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://maps.google.com/location',
      '_blank',
      'noopener,noreferrer'
    );
    expect(onClick).not.toHaveBeenCalled();
    
    windowOpenSpy.mockRestore();
  });

  it('should not propagate click event when location icon is clicked', async () => {
    const onClick = vi.fn();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const locationIcon = screen.getByAltText('Open location');
    await user.click(locationIcon);
    
    expect(onClick).not.toHaveBeenCalled();
    
    windowOpenSpy.mockRestore();
  });

  it('should use img property if available', () => {
    const propertyWithImg = { ...mockProperty, img: 'https://example.com/direct-image.jpg' };
    const onClick = vi.fn();
    
    render(<PropertyCard property={propertyWithImg} onClick={onClick} />);
    
    const image = screen.getByAltText('Mumbai');
    expect(image).toHaveAttribute('src', 'https://example.com/direct-image.jpg');
  });

  it('should handle property with name as alt text', () => {
    const propertyWithName = { ...mockProperty, city: undefined };
    const onClick = vi.fn();
    
    render(<PropertyCard property={propertyWithName} onClick={onClick} />);
    
    const image = screen.getByAltText('Luxury Apartment');
    expect(image).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    const onClick = vi.fn();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const card = document.querySelector('.property-card');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('role', 'button');
  });

  it('should handle missing addressLink gracefully', async () => {
    const propertyWithoutLink = { ...mockProperty, addressLink: null };
    const onClick = vi.fn();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(<PropertyCard property={propertyWithoutLink} onClick={onClick} />);
    
    const locationIcon = screen.getByAltText('Open location');
    await user.click(locationIcon);
    
    expect(windowOpenSpy).not.toHaveBeenCalled();
    
    windowOpenSpy.mockRestore();
  });

  it('should open location when Enter key is pressed on location icon', async () => {
    const onClick = vi.fn();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const locationIcon = screen.getByAltText('Open location');
    locationIcon.focus();
    await user.keyboard('{Enter}');
    
    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://maps.google.com/location',
      '_blank',
      'noopener,noreferrer'
    );
    expect(onClick).not.toHaveBeenCalled();
    
    windowOpenSpy.mockRestore();
  });

  it('should not open location when other key is pressed on location icon', async () => {
    const onClick = vi.fn();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => {});
    const user = userEvent.setup();
    
    render(<PropertyCard property={mockProperty} onClick={onClick} />);
    
    const locationIcon = screen.getByAltText('Open location');
    locationIcon.focus();
    await user.keyboard('{Space}');
    
    expect(windowOpenSpy).not.toHaveBeenCalled();
    
    windowOpenSpy.mockRestore();
  });

  it('should render with minimal property data', () => {
    const minimalProperty = {
      _id: '1',
      name: 'Basic Property',
      city: 'Delhi',
      BHK: '1',
      rent: 5000,
      imgLink: [],
    };
    const onClick = vi.fn();
    
    render(<PropertyCard property={minimalProperty} onClick={onClick} />);
    
    expect(screen.getByText('Basic Property')).toBeInTheDocument();
    expect(screen.getByText('Delhi — 1 BHK')).toBeInTheDocument();
    expect(screen.getByText('Rent: ₹5000')).toBeInTheDocument();
  });
});
