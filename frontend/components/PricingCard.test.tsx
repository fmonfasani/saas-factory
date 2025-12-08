import { render, screen } from '@testing-library/react';
import { PricingCard } from './PricingCard';
import type { PricingPlan } from '@/types';

describe('PricingCard', () => {
  const mockPlan: PricingPlan = {
    name: 'Basic',
    price: '$9',
    period: 'month',
    description: 'Perfect for individuals',
    features: ['Up to 5 projects', 'Basic analytics', 'Email support'],
    cta: 'Get Started',
    highlighted: false,
  };

  it('renders plan name correctly', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
  });

  it('renders price and period correctly', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByText('$9')).toBeInTheDocument();
    expect(screen.getByText('/month')).toBeInTheDocument();
  });

  it('renders description correctly', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByText('Perfect for individuals')).toBeInTheDocument();
  });

  it('renders all features', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByText('Up to 5 projects')).toBeInTheDocument();
    expect(screen.getByText('Basic analytics')).toBeInTheDocument();
    expect(screen.getByText('Email support')).toBeInTheDocument();
  });

  it('renders call to action button', () => {
    render(<PricingCard plan={mockPlan} />);
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('applies highlight styling when plan is highlighted', () => {
    const highlightedPlan = { ...mockPlan, highlighted: true };
    render(<PricingCard plan={highlightedPlan} />);
    const card = screen.getByText('Basic').closest('div');
    expect(card).toHaveClass('ring-2');
    expect(card).toHaveClass('ring-blue-500');
  });

  it('does not apply highlight styling when plan is not highlighted', () => {
    render(<PricingCard plan={mockPlan} />);
    const card = screen.getByText('Basic').closest('div');
    expect(card).not.toHaveClass('ring-2');
    expect(card).not.toHaveClass('ring-blue-500');
  });
});