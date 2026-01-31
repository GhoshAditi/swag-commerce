'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Calendar, Receipt, Tag, ArrowLeft, ShoppingBag } from 'lucide-react'
import Navbar from '../../components/Navbar'

interface OrderItem {
  product_id: string
  product_name: string | null
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderHistoryItem {
  order_id: string
  items: OrderItem[]
  total_amount: number
  items_count: number
  coupons_used: string[]
  created_at: string
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is customer (not admin)
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/signin')
      return
    }

    const userData = JSON.parse(user)
    if (userData.role === 'admin') {
      router.push('/admin/ai')
      return
    }

    fetchOrderHistory()
  }, [router])

  const fetchOrderHistory = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/signin')
        return
      }

      const response = await fetch(`${API_URL}/api/orders/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to load order history')
      }
    } catch (error) {
      console.error('Error fetching order history:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewBill = (orderId: string) => {
    router.push(`/bill/${orderId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center space-x-3">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              <span>My Orders</span>
            </h1>
            <p className="text-gray-600 mt-2">Track and manage your order history</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Shopping</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.order_id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-md">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                        <p className="font-mono text-sm font-semibold text-gray-800">{order.order_id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Order Date</p>
                          <p className="text-sm font-semibold text-gray-800">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Items</p>
                          <p className="text-sm font-semibold text-gray-800">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Tag className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Coupons Used</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.coupons_used.length > 0 ? order.coupons_used.join(', ') : 'None'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Items Purchased:
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg hover:shadow-md transition">
                            <span className="font-medium text-gray-800">{item.product_name || item.product_id}</span>
                            <span className="text-gray-600">
                              <span className="font-semibold">{item.quantity}</span> × ${item.unit_price.toFixed(2)} = 
                              <span className="font-bold text-blue-600 ml-2">${item.total_price.toFixed(2)}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:text-right w-full lg:w-auto lg:ml-6 flex flex-col items-center lg:items-end">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                      ${order.total_amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => viewBill(order.order_id)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2"
                    >
                      <Receipt className="w-5 h-5" />
                      <span>View Bill</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
