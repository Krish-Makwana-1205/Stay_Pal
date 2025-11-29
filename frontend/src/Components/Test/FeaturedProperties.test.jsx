import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeaturedProperties from './FeaturedProperties';

describe('FeaturedProperties Component', () => {
  const mockProperties = [
    {
      _id: '1',
      name: 'Property 1',
      city: 'Mumbai',
      BHK: '2',
      rent: 15000,
      imgLink: ['https://example.com/img1.jpg'],
    },
    {
      _id: '2',
      name: 'Property 2',
      city: 'Delhi',
      BHK: '3',
      rent: 20000,
      imgLink: ['https://example.com/img2.jpg'],
    },
    {
      _id: '3',
      name: 'Property 3',
      city: 'Bangalore',
      BHK: '1',
      rent: 12000,
      imgLink: ['https://example.com/img3.jpg'],
    },
    {
      _id: '4',
      name: 'Property 4',
      city: 'Pune',
      BHK: '2',
      rent: 18000,
      imgLink: ['https://example.com/img4.jpg'],
    },
    {
      _id: '5',
      name: 'Property 5',
      city: 'Chennai',
      BHK: '3',
      rent: 22000,
      imgLink: ['https://example.com/img5.jpg'],
    },
  ];

  it('should render loading state', () => {
    render(<FeaturedProperties loading={true} error={null} properties={[]} onPropertyClick={vi.fn()} />);
    
    expect(screen.getByText('Loading properties…')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(<FeaturedProperties loading={false} error="Failed to load" properties={[]} onPropertyClick={vi.fn()} />);
    
    const errorMessage = screen.getByText('Failed to load');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveStyle({ color: 'red' });
  });

  it('should render empty state when no properties', () => {
    render(<FeaturedProperties loading={false} error={null} properties={[]} onPropertyClick={vi.fn()} />);
    
    expect(screen.getByText('Select a city to view available properties.')).toBeInTheDocument();
  });

  it('should render empty state when properties is null', () => {
    render(<FeaturedProperties loading={false} error={null} properties={null} onPropertyClick={vi.fn()} />);
    
    expect(screen.getByText('Select a city to view available properties.')).toBeInTheDocument();
  });

  it('should render properties correctly', () => {
    const onPropertyClick = vi.fn();
    
    render(<FeaturedProperties loading={false} error={null} properties={mockProperties} onPropertyClick={onPropertyClick} />);
    
    expect(screen.getByText('Property 1')).toBeInTheDocument();
    expect(screen.getByText('Property 2')).toBeInTheDocument();
    expect(screen.getByText('Property 3')).toBeInTheDocument();
    expect(screen.getByText('Property 4')).toBeInTheDocument();
  });

  it('should only render first 4 properties', () => {
    const onPropertyClick = vi.fn();
    
    render(<FeaturedProperties loading={false} error={null} properties={mockProperties} onPropertyClick={onPropertyClick} />);
    
    expect(screen.getByText('Property 1')).toBeInTheDocument();
    expect(screen.getByText('Property 4')).toBeInTheDocument();
    expect(screen.queryByText('Property 5')).not.toBeInTheDocument();
  });

  it('should call onPropertyClick when property is clicked', async () => {
    const onPropertyClick = vi.fn();
    const user = userEvent.setup();
    
    render(<FeaturedProperties loading={false} error={null} properties={mockProperties} onPropertyClick={onPropertyClick} />);
    
    const propertyCards = screen.getAllByRole('button');
    await user.click(propertyCards[0]);
    
    expect(onPropertyClick).toHaveBeenCalledWith(mockProperties[0]);
  });

  it('should render properties without _id using index as key', () => {
    const propertiesWithoutId = mockProperties.map(p => {
      const { _id, ...rest } = p;
      return rest;
    });
    
    const onPropertyClick = vi.fn();
    
    render(<FeaturedProperties loading={false} error={null} properties={propertiesWithoutId} onPropertyClick={onPropertyClick} />);
    
    expect(screen.getByText('Property 1')).toBeInTheDocument();
  });

  it('should have correct container class', () => {
    const onPropertyClick = vi.fn();
    
    const { container } = render(
      <FeaturedProperties loading={false} error={null} properties={mockProperties} onPropertyClick={onPropertyClick} />
    );
    
    expect(container.querySelector('.featured-properties')).toBeInTheDocument();
  });

  it('should render exactly 4 property cards when more than 4 properties exist', () => {
    const onPropertyClick = vi.fn();
    
    render(<FeaturedProperties loading={false} error={null} properties={mockProperties} onPropertyClick={onPropertyClick} />);
    
    const propertyCards = document.querySelectorAll('.property-card');
    expect(propertyCards).toHaveLength(4);
  });

  it('should render all properties when less than 4 exist', () => {
    const twoProperties = mockProperties.slice(0, 2);
    const onPropertyClick = vi.fn();
    
    render(<FeaturedProperties loading={false} error={null} properties={twoProperties} onPropertyClick={onPropertyClick} />);
    
    const propertyCards = document.querySelectorAll('.property-card');
    expect(propertyCards).toHaveLength(2);
  });
});
