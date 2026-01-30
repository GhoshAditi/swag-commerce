'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Calendar, Receipt, Tag, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'

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
    fetchOrderHistory()
  }, [])

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/signin')
        return
      }

      const response = await fetch('http://localhost:8000/api/orders/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        alert('Failed to load order history')
      }
    } catch (error) {
      console.error('Error fetching order history:', error)
      alert('Failed to load order history')
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
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <Package className="w-8 h-8" />
            <span>Order History</span>
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.order_id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono text-sm text-gray-800">{order.order_id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-gray-500">Order Date</p>
                          <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-gray-500">Items</p>
                          <p className="text-sm font-medium">{order.items_count} item{order.items_count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Tag className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-gray-500">Coupons Used</p>
                          <p className="text-sm font-medium">
                            {order.coupons_used.length > 0 ? order.coupons_used.join(', ') : 'None'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="mt-4 border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Items Purchased:</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <span className="font-medium">{item.product_name || item.product_id}</span>
                            <span>Qty: {item.quantity} × ${item.unit_price.toFixed(2)} = ${item.total_price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-800 mb-4">${order.total_amount.toFixed(2)}</p>
                    <button
                      onClick={() => viewBill(order.order_id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Receipt className="w-4 h-4" />
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
