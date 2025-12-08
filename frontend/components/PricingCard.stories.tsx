import type { Meta, StoryObj } from '@storybook/react';
import { PricingCard } from './PricingCard';
import type { PricingPlan } from '@/types';

const meta: Meta<typeof PricingCard> = {
  title: 'Components/PricingCard',
  component: PricingCard,
  argTypes: {
    onAction: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof PricingCard>;

const basicPlan: PricingPlan = {
  name: 'Basic',
  price: '$9',
  period: 'month',
  description: 'Perfect for individuals getting started',
  features: [
    'Up to 5 projects',
    'Basic analytics',
    'Email support',
    '1GB storage',
  ],
  cta: 'Get Started',
  highlighted: false,
};

const proPlan: PricingPlan = {
  name: 'Pro',
  price: '$29',
  period: 'month',
  description: 'For growing teams and businesses',
  features: [
    'Unlimited projects',
    'Advanced analytics',
    'Priority email support',
    '10GB storage',
    'Custom domains',
    'API access',
  ],
  cta: 'Try Free for 14 Days',
  highlighted: true,
};

const enterprisePlan: PricingPlan = {
  name: 'Enterprise',
  price: 'Custom',
  period: '',
  description: 'For large organizations with advanced needs',
  features: [
    'Everything in Pro plan',
    'Unlimited storage',
    '24/7 phone & email support',
    'SSO integration',
    'Custom integrations',
    'Dedicated account manager',
  ],
  cta: 'Contact Sales',
  highlighted: false,
};

export const Basic: Story = {
  args: {
    plan: basicPlan,
  },
};

export const Pro: Story = {
  args: {
    plan: proPlan,
  },
};

export const Enterprise: Story = {
  args: {
    plan: enterprisePlan,
  },
};