'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

interface BillingInfo {
  currentPlan: 'free' | 'pro' | 'enterprise';
  renewalDate: string;
  nextBillingAmount: string;
  invoices: Invoice[];
}

export function BillingSection() {
  const router = useRouter();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate with mock data
    setTimeout(() => {
      setBillingInfo({
        currentPlan: 'pro',
        renewalDate: '2024-02-15',
        nextBillingAmount: '$29.00',
        invoices: [
          { id: 'INV-001', date: '2023-11-15', amount: '$29.00', status: 'paid' },
          { id: 'INV-002', date: '2023-10-15', amount: '$29.00', status: 'paid' },
          { id: 'INV-003', date: '2023-09-15', amount: '$29.00', status: 'paid' },
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleManageSubscription = () => {
    // In a real app, this would redirect to a payment portal
    alert('Redirecting to subscription management...');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!billingInfo) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-500">Unable to load billing information.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Billing Information</h2>
        <p className="text-gray-600 mt-1">Manage your subscription and payment details</p>
      </div>
      
      <div className="p-6">
        {/* Current Plan */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
            <div>
              <h4 className="font-bold text-lg capitalize">{billingInfo.currentPlan}</h4>
              <p className="text-gray-600">
                Renews on {new Date(billingInfo.renewalDate).toLocaleDateString()} • {billingInfo.nextBillingAmount}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleManageSubscription}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Manage
              </button>
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-10 h-6 bg-gray-300 rounded mr-3 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">VISA</span>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-gray-600 text-sm">Expires 12/25</p>
              </div>
            </div>
            <button className="text-primary hover:text-blue-700 font-medium">
              Update
            </button>
          </div>
        </div>
        
        {/* Invoice History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billingInfo.invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-blue-700">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}