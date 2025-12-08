'use client';

import { BillingSection } from '@/components/BillingSection';

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and payment details</p>
        </div>
        
        <BillingSection />
      </div>
    </div>
  );
}