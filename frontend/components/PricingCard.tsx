'use client';

import type { PricingPlan } from '@/types';

interface PricingCardProps {
  plan: PricingPlan;
  onAction?: (plan: PricingPlan) => void;
}

export function PricingCard({ plan, onAction }: PricingCardProps) {
  return (
    <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      plan.highlighted ? 'ring-2 ring-blue-500 transform scale-105' : 'border border-gray-200'
    }`}>
      {plan.highlighted && (
        <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="bg-white p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
            {plan.period && <span className="text-gray-600">/{plan.period}</span>}
          </div>
          <p className="text-gray-600 text-sm">{plan.description}</p>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg 
                className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onAction?.(plan)}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
            plan.highlighted
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
        >
          {plan.cta || 'Get Started'}
        </button>
      </div>
    </div>
  );
}