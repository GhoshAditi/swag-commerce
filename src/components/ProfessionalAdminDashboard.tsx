'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, ShoppingCart, Package, AlertTriangle, Bot, BarChart3, Sparkles } from 'lucide-react'
import AdminAIChat from './AdminAIChat'

interface DashboardData {
  total_revenue: number
  total_orders: number
  avg_order_value: number
  low_stock_products: number
  revenue_trend: { date: string; revenue: number }[]
  top_products: { name: string; sales: number; revenue: number }[]
  category_distribution: { category: string; count: number }[]
}

export default function ProfessionalAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai'>('overview')
  const [analytics, setAnalytics] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/analytics/dashboard`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

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

  const COLORS = ['#f97316', '#22c55e', '#6c757d', '#fbbf24', '#16a34a', '#ea580c']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-accent-500 mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading Analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-accent-500 p-2.5 rounded-xl shadow-soft">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <span>Admin Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1.5 font-medium">Real-time business intelligence & insights</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'bg-gray-900 text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics Overview
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'ai'
                  ? 'bg-gray-900 text-white shadow-soft'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bot className="w-4 h-4" />
              AI Assistant
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-soft-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-10 h-10 text-success-500 p-2 bg-success-50 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                  <div className="bg-success-50 px-2.5 py-1 rounded-md text-xs font-bold text-success-700 border border-success-200">
                    +12.3%
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</h3>
                <p className="text-3xl font-bold text-gray-900">${analytics?.total_revenue.toFixed(2) || '0.00'}</p>
              </div>

              {/* Total Orders */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-soft-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="w-10 h-10 text-accent-500 p-2 bg-accent-50 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                  <div className="bg-accent-50 px-2.5 py-1 rounded-md text-xs font-bold text-accent-700 border border-accent-200">
                    +8.2%
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Orders</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics?.total_orders || 0}</p>
              </div>

              {/* Avg Order Value */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-soft-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-10 h-10 text-warning-500 p-2 bg-warning-50 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                  <div className="bg-warning-50 px-2.5 py-1 rounded-md text-xs font-bold text-warning-700 border border-warning-200">
                    +5.3%
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Avg Order Value</h3>
                <p className="text-3xl font-bold text-gray-900">${analytics?.avg_order_value?.toFixed(2) || '0.00'}</p>
              </div>

              {/* Low Stock */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-soft-lg transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="w-10 h-10 text-gray-700 p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                  <div className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-bold text-gray-700 border border-gray-200">
                    Alert
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-1">Low Stock Items</h3>
                <p className="text-3xl font-bold text-gray-900">{analytics?.low_stock_products || 0}</p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Revenue Trend (7 Days)</h3>
                  <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">Last Week</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics?.revenue_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Category Distribution</h3>
                  <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">By Product Count</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.category_distribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics?.category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
                <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">Top 5</div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analytics?.top_products || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#f97316" name="Units Sold" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue ($)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <AdminAIChat />
          </div>
        )}
      </div>
    </div>
  )
}
