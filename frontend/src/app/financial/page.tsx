'use client';

import { DollarSign, PieChart, TrendingUp, Clock, Download, Filter, Plus } from 'lucide-react';

export default function FinancialPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Financial</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your billing and finances</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-5 h-5 mr-2" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', amount: '$45,250', change: '+12.5%', icon: <DollarSign className="w-6 h-6" /> },
          { label: 'Outstanding', amount: '$12,450', change: '-2.4%', icon: <Clock className="w-6 h-6" /> },
          { label: 'Invoiced', amount: '$58,000', change: '+8.2%', icon: <PieChart className="w-6 h-6" /> },
          { label: 'Growth', amount: '23.5%', change: '+4.1%', icon: <TrendingUp className="w-6 h-6" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stat.amount}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{stat.change} from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Transactions</h2>
          <button className="inline-flex items-center px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { client: 'Johnson & Co.', type: 'Invoice Payment', amount: '+$2,500', date: '2 hours ago', status: 'Completed' },
            { client: 'Smith LLC', type: 'Retainer Fee', amount: '+$5,000', date: 'Yesterday', status: 'Pending' },
            { client: 'Tech Corp', type: 'Consultation Fee', amount: '+$750', date: '3 days ago', status: 'Completed' },
          ].map((transaction) => (
            <div key={transaction.client} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.client}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.amount}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === 'Completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Upcoming Payments</h3>
          <div className="space-y-4">
            {[
              { client: 'Williams Corp', amount: '$3,500', due: 'Due in 3 days' },
              { client: 'Legal Solutions Inc', amount: '$1,200', due: 'Due in 5 days' },
            ].map((payment) => (
              <div key={payment.client} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.client}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{payment.due}</p>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {[
              { type: 'Visa', last4: '•••• 4242', expiry: '04/24' },
              { type: 'Mastercard', last4: '•••• 5555', expiry: '07/25' },
            ].map((card) => (
              <div key={card.last4} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs font-medium">{card.type[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{card.type}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.last4}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Expires {card.expiry}</p>
              </div>
            ))}
            <button className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 