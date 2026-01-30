'use client'

import { useState } from 'react'
import { BarChart3, Package, DollarSign, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react'
import AdminAIChat from './AdminAIChat'

// Mock analytics data
const mockAnalytics = {
  totalRevenue: 45250.00,
  totalOrders: 127,
  topProducts: [
    { id: '1', name: 'Premium Company T-Shirt', revenue: 18750, quantity: 750 },
    { id: '2', name: 'Branded Water Bottle', revenue: 12600, quantity: 840 },
    { id: '3', name: 'Custom Laptop Stickers', revenue: 8960, quantity: 1120 },
  ],
  lowStockItems: [
    { id: '4', name: 'Executive Notebook', currentStock: 15 },
    { id: '1', name: 'Premium Company T-Shirt', currentStock: 25 },
  ],
  revenueByDay: [
    { date: '2026-01-23', revenue: 5200 },
    { date: '2026-01-24', revenue: 6100 },
    { date: '2026-01-25', revenue: 7300 },
    { date: '2026-01-26', revenue: 8200 },
    { date: '2026-01-27', revenue: 6800 },
    { date: '2026-01-28', revenue: 9100 },
    { date: '2026-01-29', revenue: 8500 },
  ]
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai'>('overview')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-8 h-8" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-xl opacity-90">
          Analytics overview and AI-powered insights for data-driven decisions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 font-medium transition-all rounded-t-lg ${
            activeTab === 'overview'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-6 py-2 font-medium transition-all rounded-t-lg ${
            activeTab === 'ai'
              ? 'bg-white text-primary-600 border-b-2 border-primary-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-2" />
          AI Assistant
        </button>
      </div>

      {/* Content */}
      {activeTab === 'ai' ? (
        <AdminAIChat />
      ) : (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-success-500" />
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-slate-800">${mockAnalytics.totalRevenue.toLocaleString()}</p>
                <p className="text-success-600 text-sm mt-2">+15% from last week</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-slate-800">{mockAnalytics.totalOrders}</p>
                <p className="text-primary-600 text-sm mt-2">+8% from last week</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-accent-500" />
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">Avg. Order Value</p>
                <p className="text-3xl font-bold text-slate-800">${(mockAnalytics.totalRevenue / mockAnalytics.totalOrders).toFixed(0)}</p>
                <p className="text-accent-600 text-sm mt-2">+12% from last week</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning-600" />
                </div>
              </div>
              <div>
                <p className="text-slate-600 text-sm mb-1">Low Stock Alerts</p>
                <p className="text-3xl font-bold text-slate-800">{mockAnalytics.lowStockItems.length}</p>
                <p className="text-warning-600 text-sm mt-2">Items need restocking</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="space-y-6">
              {/* Top Products */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">Top Products</h3>
                <div className="space-y-3">
                  {mockAnalytics.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-slate-500 text-xs">{product.quantity} sold</p>
                        </div>
                      </div>
                      <p className="font-bold text-success-600">${product.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-warning-500 mr-2" />
                  Low Stock Alerts
                </h3>
                <div className="space-y-3">
                  {mockAnalytics.lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                      <p className="font-medium text-sm">{item.name}</p>
                      <span className="text-warning-700 font-bold text-sm">{item.currentStock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">7-Day Revenue Trend</h3>
              <div className="space-y-3">
                {mockAnalytics.revenueByDay.map((day) => (
                  <div key={day.date} className="flex items-center justify-between">
                    <p className="text-sm text-slate-600 w-32">{new Date(day.date).toLocaleDateString()}</p>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full flex items-center justify-end pr-3"
                          style={{ width: `${(day.revenue / 10000) * 100}%` }}
                        >
                          <span className="text-white text-xs font-medium">${day.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
