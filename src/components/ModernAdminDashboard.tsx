'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Package, DollarSign, TrendingUp, AlertTriangle, ShoppingCart, Users, Sparkles, Activity, Target } from 'lucide-react'
import AdminAIChat from './AdminAIChat'

interface Analytics {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  topProducts: Array<{ name: string; revenue: number; quantity: number }>
  lowStockItems: Array<{ name: string; currentStock: number }>
  revenueByDay: Array<{ date: string; revenue: number }>
}

export default function ModernAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai'>('overview')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/analytics/dashboard')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Analytics Dashboard</h1>
                <p className="text-blue-100 mt-1">Real-time business insights & AI assistance</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Activity className="w-5 h-5 inline mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'ai'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Sparkles className="w-5 h-5 inline mr-2" />
                AI Assistant
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    +12.5%
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics?.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    +8.2%
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Total Orders</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics?.totalOrders || 0}</p>
              </div>

              {/* Average Order Value */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    +5.3%
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Avg Order Value</h3>
                <p className="text-3xl font-bold text-gray-900">
                  ${analytics?.avgOrderValue?.toFixed(2) || '0'}
                </p>
              </div>

              {/* Low Stock Items */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                    Alert
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">Low Stock Items</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.lowStockItems?.length || 0}
                </p>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Revenue Trend</h2>
                <div className="text-sm text-gray-600">Last 7 days</div>
              </div>
              <div className="relative h-64">
                {analytics?.revenueByDay && analytics.revenueByDay.length > 0 ? (
                  <div className="flex items-end justify-between h-full space-x-2">
                    {analytics.revenueByDay.map((day, index) => {
                      const maxRevenue = Math.max(...analytics.revenueByDay.map(d => d.revenue))
                      const height = (day.revenue / maxRevenue) * 100
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative group"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ${day.revenue.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No revenue data available
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Top Products</h2>
                </div>
                <div className="space-y-4">
                  {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                    analytics.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${product.revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600">Revenue</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">No product data available</div>
                  )}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h2>
                </div>
                <div className="space-y-4">
                  {analytics?.lowStockItems && analytics.lowStockItems.length > 0 ? (
                    analytics.lowStockItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-center space-x-3">
                          <Package className="w-5 h-5 text-orange-600" />
                          <p className="font-semibold text-gray-900">{item.name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-orange-600">{item.currentStock} left</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">All items well stocked!</div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <AdminAIChat />
          </div>
        )}
      </div>
    </div>
  )
}
