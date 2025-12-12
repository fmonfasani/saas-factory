'use client';

import React, { useState } from 'react';
import { useAuth, useOrganization } from '@/contexts';
import { useRouter } from 'next/navigation';
import { billingApi, mercadopagoApi } from '@/lib/api';

export default function MercadoPagoPricingPage() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'hobby' | 'pro'>('hobby');

  const handleStripeUpgrade = async () => {
    try {
      setLoading(true);
      // Use billingApi which handles Auth headers correctly and defaults priceId
      const session = await billingApi.createCheckoutSession('');
      
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert('Failed to start checkout');
      }
    } catch (error) {
      console.error('Stripe upgrade error:', error);
      alert('Error initiating upgrade. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMercadoPagoUpgrade = async () => {
    try {
      setLoading(true);
      // Create a preference for one-time payment
      const preference = await mercadopagoApi.createPaymentPreference({
        title: 'SaaS Factory Pro Plan',
        price: 29000, // ARS $290
        options: {
          currency_id: 'ARS'
        }
      });
      
      if (preference.init_point) {
        window.location.href = preference.init_point;
      } else {
        alert('Failed to start checkout');
      }
    } catch (error) {
      console.error('Mercado Pago upgrade error:', error);
      alert('Error initiating upgrade. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionUpgrade = async () => {
    try {
      setLoading(true);
      // For recurring subscriptions, we would first create a plan and then subscribe
      // This is a simplified example
      const planData = {
        reason: 'SaaS Factory Pro Monthly Subscription',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: 29000,
          currency_id: 'ARS'
        },
        back_url: `${window.location.origin}/dashboard?subscription=success`
      };
      
      // In a real implementation, you would create the plan once and reuse the planId
      // For demo purposes, we're showing the flow
      alert('In a full implementation, this would create a subscription plan and redirect to Mercado Pago for approval.');
      
      // Example flow:
      // 1. Create plan (done by admin or in backend)
      // 2. Subscribe user to plan
      // const subscription = await mercadopagoApi.subscribeToPlan(planId);
      // if (subscription.init_point) {
      //   window.location.href = subscription.init_point;
      // }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Error initiating subscription. Please try again.');
    } finally {
      setLoading(false);
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
            $290 <span className="text-base font-normal text-gray-400">/mo</span>
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
          
          <div className="space-y-3">
            <button
              onClick={handleStripeUpgrade}
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upgrade with Stripe'}
            </button>
            
            <button
              onClick={handleMercadoPagoUpgrade}
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay with Mercado Pago'}
            </button>
            
            <button
              onClick={handleSubscriptionUpgrade}
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Subscribe (Recurring)'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-gray-600 max-w-2xl">
        <p>All plans include a 14-day free trial. No credit card required to get started.</p>
        <p className="mt-2">Need a custom plan? <a href="mailto:support@saasfactory.com" className="text-blue-600 hover:underline">Contact us</a></p>
      </div>
    </div>
  );
}