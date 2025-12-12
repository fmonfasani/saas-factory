'use client';

import React from 'react';
import { useAuth, useOrganization } from '@/contexts';
import { useRouter } from 'next/navigation';
import { billingApi } from '@/lib/api';

export default function PricingPage() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const router = useRouter();

  const handleUpgrade = async () => {
    try {
      // Use billingApi which handles Auth headers correctly and defaults priceId
      const session = await billingApi.createCheckoutSession('');

      if (session.url) {
        window.location.href = session.url;
      } else {
        alert('Failed to start checkout');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Error initiating upgrade. Please try logging in again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Everything you need to build and deploy your SaaS.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Hobby</h3>
          <p className="text-gray-500 mb-6">For tinkering and testing ideas.</p>
          <div className="text-4xl font-extrabold text-gray-900 mb-6">
            $0 <span className="text-base font-normal text-gray-500">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Unlimited AI Generations
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Landing Page Preview
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Database Schema Design
            </li>
          </ul>
          <button
            disabled
            className="w-full py-3 px-6 rounded-lg bg-gray-100 text-gray-500 font-semibold cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
          <p className="text-gray-400 mb-6">For serious builders shipping products.</p>
          <div className="text-4xl font-extrabold text-white mb-6">
            $29 <span className="text-base font-normal text-gray-400">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Everything in Hobby
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Export Code (ZIP)
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Real Database Hosting
            </li>
            <li className="flex items-center text-gray-300">
              <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Deploy to Custom Domain
            </li>
          </ul>
          <button
            onClick={handleUpgrade}
            className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg hover:shadow-blue-500/25 mb-4"
          >
            Upgrade with Stripe
          </button>

          <button
            onClick={async () => {
              try {
                // Call API to create subscription
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX}/billing/mp/subscribe`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                  }
                });
                const data = await res.json();
                if (data.init_point) {
                  window.location.href = data.init_point;
                } else {
                  alert('Error creating MP subscription');
                }
              } catch (e) {
                console.error(e);
                alert('Connection error');
              }
            }}
            className="w-full py-3 px-6 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-colors shadow-lg"
          >
            Suscribirse con Mercado Pago
          </button>
        </div>
      </div>
    </div>
  );
}