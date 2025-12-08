# PricingCard Component

A reusable component for displaying pricing plans with features, price, and action buttons.

## Usage

```tsx
import { PricingCard } from '@/components';
import type { PricingPlan } from '@/types';

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

function PricingPage() {
  const handlePlanSelect = (plan: PricingPlan) => {
    console.log('Selected plan:', plan);
    // Handle plan selection logic
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <PricingCard plan={basicPlan} onAction={handlePlanSelect} />
    </div>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `plan` | `PricingPlan` | The pricing plan data to display |
| `onAction` | `(plan: PricingPlan) => void` | Callback function triggered when the CTA button is clicked |

## PricingPlan Interface

```ts
interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}
```

## Features

- Responsive design that works on all screen sizes
- Visual highlighting for featured plans
- Accessible markup with proper semantic elements
- Customizable action callback
- Clean, modern styling with hover effects
- Support for custom pricing periods (monthly, annual, etc.)
- Support for custom call-to-action text

## Styling

The component uses Tailwind CSS classes for styling. The highlighted plan has a special blue border and is slightly scaled up to draw attention.