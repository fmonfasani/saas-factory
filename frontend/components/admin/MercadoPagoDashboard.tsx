// frontend/components/admin/MercadoPagoDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { mercadopagoApi } from '@/lib/api';

export default function MercadoPagoAdminDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactionLogs();
  }, [filter]);

  const fetchTransactionLogs = async () => {
    try {
      setLoading(true);
      // In a real implementation, you would call an admin API endpoint
      // const response = await adminApi.getMpTransactionLogs(filter);
      // setLogs(response.logs);
      
      // Mock data for demonstration
      setLogs([
        {
          id: 'log_1',
          type: 'preapproval',
          status: 'success',
          organization: 'Acme Corp',
          amount: 29000,
          currency: 'ARS',
          createdAt: new Date().toISOString()
        },
        {
          id: 'log_2',
          type: 'webhook',
          status: 'failed',
          organization: 'Tech Startup',
          error: 'Signature verification failed',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'log_3',
          type: 'preference',
          status: 'success',
          organization: 'Digital Agency',
          amount: 15000,
          currency: 'ARS',
          createdAt: new Date(Date.now() - 7200000).toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error fetching transaction logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mercado Pago Transactions</h2>
        <div className="flex space-x-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="preapproval">Subscriptions</option>
            <option value="preference">Payments</option>
            <option value="webhook">Webhooks</option>
          </select>
          <button
            onClick={fetchTransactionLogs}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)} Transaction
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Organization: {log.organization}
                      </p>
                      {log.amount && (
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Amount: {log.amount.toLocaleString('es-AR', {
                            style: 'currency',
                            currency: log.currency,
                          })}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {log.error && (
                    <div className="mt-2">
                      <p className="text-sm text-red-600">
                        Error: {log.error}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}