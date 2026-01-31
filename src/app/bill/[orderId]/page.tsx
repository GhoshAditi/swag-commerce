'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Receipt, Download, ArrowLeft, CheckCircle } from 'lucide-react'
import Navbar from '../../../components/Navbar'

interface OrderItem {
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
}

interface AppliedCoupon {
  code: string
  discount_type: string
  discount_value: number
  discount_amount: number
}

interface Bill {
  order_id: string
  customer_name: string
  customer_email: string
  items: OrderItem[]
  subtotal: number
  applied_coupons: AppliedCoupon[]
  total_discount: number
  final_total: number
  created_at: string
  status: string
}

export default function BillPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const [bill, setBill] = useState<Bill | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBill()
  }, [orderId])

  const fetchBill = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/signin')
        return
      }

      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Transform response to match component expectations
        const transformedBill = {
          ...data,
          order_id: data.order_id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          items: data.items,
          subtotal: data.subtotal,
          applied_coupons: data.applied_coupons || [],
          total_discount: data.total_discount,
          final_total: data.final_total,
          created_at: data.created_at,
          status: data.status
        }
        setBill(transformedBill)
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to load bill: ${errorData.detail || 'Unknown error'}`)
        router.push('/orders')
      }
    } catch (error) {
      console.error('Error fetching bill:', error)
      alert('Failed to load bill')
    } finally {
      setLoading(false)
    }
  }

  const printBill = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Loading bill...</p>
        </div>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-600">Bill not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center space-x-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-green-800">Order Confirmed!</h2>
            <p className="text-green-700">Thank you for your purchase. Your order has been placed successfully.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/orders')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>View Order History</span>
          </button>
          <button
            onClick={printBill}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Print Bill</span>
          </button>
        </div>

        {/* Bill */}
        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none">
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Receipt className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order ID</p>
                <p className="font-mono text-gray-800">{bill.order_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="text-gray-800">{new Date(bill.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Customer Name</p>
                <p className="text-gray-800">{bill.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="text-gray-800">{bill.customer_email}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Product ID</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-medium">Quantity</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Unit Price</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-mono text-sm text-gray-700">{item.product_id}</td>
                    <td className="py-3 px-4 text-center text-gray-800">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-800">${item.unit_price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-800">${item.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="border-t pt-6">
            <div className="max-w-sm ml-auto space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${bill.subtotal.toFixed(2)}</span>
              </div>

              {bill.applied_coupons && bill.applied_coupons.length > 0 && (
                <>
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Applied Coupons:</p>
                    {bill.applied_coupons.map((coupon, index) => (
                      <div key={index} className="flex justify-between text-sm text-green-600 ml-2">
                        <span>{coupon.code} ({coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value}`})</span>
                        <span>-${coupon.discount_amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Total Discount</span>
                    <span>-${bill.total_discount.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="border-t pt-3 flex justify-between text-2xl font-bold text-gray-800">
                <span>Total Paid</span>
                <span>${bill.final_total.toFixed(2)}</span>
              </div>

              <div className="text-center pt-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  bill.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {bill.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-2">SwagCommerce - Bulk Merchandise Platform</p>
          </div>
        </div>
      </div>
    </div>
  )
}
