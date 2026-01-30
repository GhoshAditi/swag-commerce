'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, Tag, Receipt, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'

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
    // Load cart from session storage
    const savedCart = sessionStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    // Fetch available coupons
    fetchCoupons()
  }, [])

  useEffect(() => {
    // Recalculate cart whenever items or coupons change
    if (cartItems.length > 0) {
      calculateCart()
    }
  }, [cartItems, selectedCoupons])

  const fetchCoupons = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/coupons/')
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
      const response = await fetch('http://localhost:8000/api/carts/calculate/', {
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
  }

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.product_id !== productId)
    setCartItems(updatedCart)
    sessionStorage.setItem('cart', JSON.stringify(updatedCart))
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
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/api/orders/', {
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
        const bill = await response.json()
        // Clear cart
        sessionStorage.removeItem('cart')
        // Redirect to bill page
        router.push(`/bill/${bill.order_id}`)
      } else {
        const error = await response.json()
        alert(error.detail || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    )
  }

  const subtotal = cartCalculation?.subtotal || cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalDiscount = cartCalculation?.total_discount || 0
  const finalTotal = cartCalculation?.final_total || subtotal

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <ShoppingCart className="w-8 h-8" />
            <span>Shopping Cart</span>
          </h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.product_id} className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-600 hover:text-red-700 mt-2 flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Coupons and Summary */}
          <div className="space-y-6">
            {/* Available Coupons */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Available Coupons</span>
              </h2>
              
              {availableCoupons.length === 0 ? (
                <p className="text-gray-500 text-sm">No coupons available</p>
              ) : (
                <div className="space-y-2">
                  {availableCoupons.map(coupon => {
                    const isExpiringSoon = coupon.expires_at && 
                      new Date(coupon.expires_at).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days
                    const hasUsageLimit = coupon.usage_limit !== null;
                    
                    return (
                      <div
                        key={coupon.id}
                        className={`border rounded p-3 cursor-pointer transition ${
                          selectedCoupons.includes(coupon.code)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-blue-300'
                        } ${(!cartCalculation?.can_add_more_coupons && !selectedCoupons.includes(coupon.code)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => {
                          if (cartCalculation?.can_add_more_coupons || selectedCoupons.includes(coupon.code)) {
                            toggleCoupon(coupon.code);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 flex items-center">
                              {coupon.code}
                              {coupon.makes_free && (
                                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">
                                  100% OFF
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {coupon.makes_free
                                ? '🎁 Makes your order completely FREE ($0)!'
                                : coupon.discount_type === 'percentage'
                                ? `${coupon.discount_value}% off your order`
                                : `$${coupon.discount_value} off your order`}
                            </p>
                            
                            {/* Expiration and Usage Info */}
                            <div className="mt-2 space-y-1">
                              {coupon.expires_at && (
                                <p className={`text-xs ${isExpiringSoon ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                                  {isExpiringSoon && '⚠️ '}
                                  Expires: {new Date(coupon.expires_at).toLocaleDateString()}
                                </p>
                              )}
                              {hasUsageLimit && (
                                <p className="text-xs text-gray-500">
                                  Used: {coupon.used_count}/{coupon.usage_limit}
                                </p>
                              )}
                            </div>
                          </div>
                          {selectedCoupons.includes(coupon.code) && (
                            <div className="text-green-600 text-xl">✓</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Info messages */}
              {finalTotal === 0 && cartCalculation && cartCalculation.applied_coupons.length > 0 && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800 text-sm font-medium">
                  🎉 Your order is completely FREE! No more coupons can be applied.
                </div>
              )}
              
              {!cartCalculation?.can_add_more_coupons && finalTotal > 0 && selectedCoupons.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  ℹ️ Maximum discount applied. Additional coupons unavailable.
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                {/* Original Price */}
                <div className="flex justify-between text-gray-800">
                  <span className="font-medium">Original Price</span>
                  <span className="font-semibold text-lg">${subtotal.toFixed(2)}</span>
                </div>
                
                {cartCalculation?.applied_coupons && cartCalculation.applied_coupons.length > 0 && (
                  <>
                    <div className="border-t pt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Applied Discounts:</p>
                      {cartCalculation.applied_coupons.map((coupon, index) => (
                        <div key={index} className="flex justify-between text-sm text-green-600 ml-2 mb-1">
                          <span className="flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            {coupon.code}
                          </span>
                          <span className="font-medium">-${coupon.discount_amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-green-600 font-semibold border-t pt-2">
                      <span>Total Savings</span>
                      <span>-${totalDiscount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {/* Discounted Price / Final Total */}
                <div className={`border-t pt-3 flex justify-between text-2xl font-bold ${
                  finalTotal === 0 ? 'text-green-600' : 'text-gray-900'
                }`}>
                  <span>Discounted Price</span>
                  <span>{finalTotal === 0 ? 'FREE' : `$${finalTotal.toFixed(2)}`}</span>
                </div>
                
                {/* Price comparison highlight */}
                {totalDiscount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-green-800 font-medium text-center">
                      🎉 You save ${totalDiscount.toFixed(2)} with your coupons!
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center space-x-2 font-semibold"
              >
                <Receipt className="w-5 h-5" />
                <span>{loading ? 'Processing...' : `Checkout - ${finalTotal === 0 ? 'FREE' : `$${finalTotal.toFixed(2)}`}`}</span>
              </button>
              
              {!isLoggedIn && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  You'll be asked to sign in before checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
