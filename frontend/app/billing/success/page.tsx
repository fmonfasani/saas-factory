'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BillingSuccess() {
  const router = useRouter();

  useEffect(() => {
    // In a real app, you would verify the payment with your backend
    // For now, we'll just redirect to the dashboard after a delay
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
            <svg className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}