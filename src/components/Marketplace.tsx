'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Tag, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { Product, CartItem, CouponValidationResult } from '../types'

// Mock data - this will be replaced by API calls
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Company T-Shirt',
    description: 'High-quality cotton t-shirt with company logo',
    price: 25.00,
    stock: 150,
    image: 'https://via.placeholder.com/300x300/0ea5e9/ffffff?text=T-Shirt',
    category: 'Apparel',
    tieredPricing: [
      { minQuantity: 1, price: 25.00 },
      { minQuantity: 50, price: 22.00 },
      { minQuantity: 100, price: 20.00 },
    ]
  },
  {
    id: '2',
    name: 'Branded Water Bottle',
    description: 'Stainless steel water bottle with laser engraving',
    price: 15.00,
    stock: 200,
    image: 'https://via.placeholder.com/300x300/d946ef/ffffff?text=Bottle',
    category: 'Drinkware',
    tieredPricing: [
      { minQuantity: 1, price: 15.00 },
      { minQuantity: 25, price: 13.00 },
      { minQuantity: 100, price: 11.00 },
    ]
  },
  {
    id: '3',
    name: 'Custom Laptop Stickers',
    description: 'Weather-resistant vinyl stickers, pack of 10',
    price: 8.00,
    stock: 500,
    image: 'https://via.placeholder.com/300x300/22c55e/ffffff?text=Stickers',
    category: 'Accessories',
    tieredPricing: [
      { minQuantity: 1, price: 8.00 },
      { minQuantity: 10, price: 7.00 },
      { minQuantity: 50, price: 6.00 },
    ]
  },
  {
    id: '4',
    name: 'Executive Notebook',
    description: 'Leather-bound notebook with company embossing',
    price: 35.00,
    stock: 75,
    image: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Notebook',
    category: 'Office',
    tieredPricing: [
      { minQuantity: 1, price: 35.00 },
      { minQuantity: 25, price: 32.00 },
      { minQuantity: 50, price: 30.00 },
    ]
  }
]

export default function Marketplace() {
  const [products] = useState<Product[]>(mockProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCart, setShowCart] = useState(false)

  // Calculate current price for a product based on quantity
  const getCurrentPrice = (product: Product, quantity: number = 1) => {
    const pricing = [...product.tieredPricing].reverse()
    const tier = pricing.find(p => quantity >= p.minQuantity)
    return tier?.price || product.price
  }

  // Add to cart
  const addToCart = (productId: string, quantity: number = 1) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    setCart(prev => {
      const existing = prev.find(item => item.productId === productId)
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { productId, quantity, price: getCurrentPrice(product, quantity) }]
    })
  }

  // Update cart quantity
  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.productId !== productId))
      return
    }

    const product = products.find(p => p.id === productId)
    if (!product) return

    setCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, price: getCurrentPrice(product, newQuantity) }
          : item
      )
    )
  }

  // Validate and apply coupon
  const validateCoupon = async () => {
    if (!couponCode.trim()) return

    // Mock API call - replace with actual API
    const mockValidation: CouponValidationResult = {
      isValid: couponCode === 'SUMMER50' || couponCode === 'FREESHIP',
      discountType: couponCode === 'SUMMER50' ? 'percentage' : 'fixed',
      discountValue: couponCode === 'SUMMER50' ? 50 : 0,
      message: couponCode === 'SUMMER50' ? '50% off applied!' : 'Free shipping applied!',
      makesFree: couponCode === 'FREESHIP'
    }

    if (mockValidation.isValid) {
      setAppliedCoupon(mockValidation)
    }
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId)
    return sum + (item.price * item.quantity)
  }, 0)

  const discount = appliedCoupon?.isValid ? (
    appliedCoupon.discountType === 'percentage' 
      ? subtotal * (appliedCoupon.discountValue / 100)
      : appliedCoupon.discountValue
  ) : 0

  const total = appliedCoupon?.makesFree ? 0 : Math.max(0, subtotal - discount)

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Premium Corporate Swag & Merchandise
          </h1>
          <p className="text-xl opacity-90">
            Bulk ordering made simple. Dynamic pricing, instant quotes, and AI-powered recommendations.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
          
          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
              getCurrentPrice={getCurrentPrice}
            />
          ))}
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Shopping Cart</h3>
                <button 
                  onClick={() => setShowCart(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto max-h-[60vh]">
              {cart.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const product = products.find(p => p.id === item.productId)!
                    return (
                      <div key={item.productId} className="flex items-center space-x-3 border-b pb-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-slate-500 text-xs">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Coupon Section */}
            {cart.length > 0 && (
              <div className="p-6 border-t bg-slate-50">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={validateCoupon}
                      className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon?.isValid && (
                    <p className="text-success-600 text-sm mt-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {appliedCoupon.message}
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon?.isValid && (
                    <div className="flex justify-between text-sm text-success-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className={appliedCoupon?.makesFree ? 'text-success-600' : ''}>
                      ${total.toFixed(2)}
                      {appliedCoupon?.makesFree && ' (FREE!)'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  disabled={isCheckingOut}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-slate-300 text-white py-3 rounded-lg font-medium transition-all"
                >
                  {isCheckingOut ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Product Card Component
function ProductCard({ 
  product, 
  onAddToCart, 
  getCurrentPrice 
}: { 
  product: Product
  onAddToCart: (id: string, quantity: number) => void
  getCurrentPrice: (product: Product, quantity: number) => number
}) {
  const [quantity, setQuantity] = useState(1)

  const currentPrice = getCurrentPrice(product, quantity)
  const savings = product.price - currentPrice

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
      <div className="aspect-square rounded-t-xl overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-slate-800 mb-1">{product.name}</h3>
          <p className="text-slate-600 text-sm">{product.description}</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl font-bold text-primary-600">${currentPrice.toFixed(2)}</span>
            {savings > 0 && (
              <span className="text-sm text-slate-500 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          {savings > 0 && (
            <p className="text-success-600 text-sm flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Save ${savings.toFixed(2)} per item
            </p>
          )}

          <p className="text-slate-500 text-sm mt-1">
            {product.stock} in stock
          </p>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border border-slate-300 rounded py-1"
          />
          <button 
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-8 h-8 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => onAddToCart(product.id, quantity)}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium transition-all"
        >
          Add to Cart
        </button>

        {/* Tiered Pricing */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-1">Bulk Pricing:</p>
          <div className="text-xs space-y-1">
            {product.tieredPricing.map((tier: { minQuantity: number; price: number }, index: number) => (
              <div key={index} className="flex justify-between">
                <span>{tier.minQuantity}+ items:</span>
                <span className="font-medium">${tier.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}