'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, Tag, CreditCard, ArrowLeft, Package, AlertCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'

interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

interface Coupon {
  id: string
  code: string
  discount_type: string
  discount_value: number
  makes_free: boolean
  expires_at: string | null
  usage_limit: number | null
  used_count: number
}

interface AppliedCoupon {
  code: string
  discount_type: string
  discount_value: number
  discount_amount: number
}

interface CartCalculation {
  subtotal: number
  applied_coupons: AppliedCoupon[]
  total_discount: number
  final_total: number
  can_add_more_coupons: boolean
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([])
  const [cartCalculation, setCartCalculation] = useState<CartCalculation | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is customer (not admin)
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role === 'admin') {
        router.push('/admin/ai')
        return
      }
    }

    const savedCart = sessionStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    fetchCoupons()
  }, [router])

  useEffect(() => {
    if (cartItems.length > 0) {
      calculateCart()
    }
  }, [cartItems, selectedCoupons])

  const fetchCoupons = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/api/coupons/`)
      if (response.ok) {
        const data = await response.json()
        setAvailableCoupons(data)
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    }
  }

  const calculateCart = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/api/cart/calculate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          coupon_codes: selectedCoupons,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCartCalculation(data)
      }
    } catch (error) {
      console.error('Error calculating cart:', error)
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    const updatedCart = cartItems.map(item =>
      item.product_id === productId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    sessionStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.product_id !== productId)
    setCartItems(updatedCart)
    sessionStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const toggleCoupon = (couponCode: string) => {
    if (selectedCoupons.includes(couponCode)) {
      setSelectedCoupons(selectedCoupons.filter(c => c !== couponCode))
    } else {
      setSelectedCoupons([...selectedCoupons, couponCode])
    }
  }

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      router.push('/signin')
      return
    }

    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          coupon_codes: selectedCoupons,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        sessionStorage.removeItem('cart')
        window.dispatchEvent(new Event('cartUpdated'))
        router.push(`/bill/${order.order_id}`)
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to place order: ${errorData.detail || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shopping
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product_id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="text-red-500 hover:text-red-700 p-2 -mt-2 -mr-2 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                      {/* Price */}
                      <div>
                        <p className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">per unit</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="font-semibold text-lg text-gray-900 w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-xl font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupons Section */}
              {availableCoupons.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Available Coupons</h3>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableCoupons.map((coupon) => (
                      <label
                        key={coupon.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                          selectedCoupons.includes(coupon.code)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCoupons.includes(coupon.code)}
                          onChange={() => toggleCoupon(coupon.code)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{coupon.code}</p>
                          <p className="text-sm text-gray-600">
                            {coupon.discount_type === 'PERCENTAGE'
                              ? `${coupon.discount_value}% off`
                              : `$${coupon.discount_value} off`}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ${cartCalculation?.subtotal.toFixed(2) || '0.00'}
                  </span>
                </div>

                {cartCalculation && cartCalculation.applied_coupons.length > 0 && (
                  <div className="space-y-2">
                    {cartCalculation.applied_coupons.map((coupon, idx) => (
                      <div key={idx} className="flex justify-between text-green-600 text-sm">
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {coupon.code}
                        </span>
                        <span>-${coupon.discount_amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {cartCalculation && cartCalculation.total_discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Total Savings</span>
                    <span>-${cartCalculation.total_discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${cartCalculation?.final_total.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </>
                )}
              </button>

              {!isLoggedIn && (
                <div className="mt-4 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>You'll be redirected to sign in before checkout</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
