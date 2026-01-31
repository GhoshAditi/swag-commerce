'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus, Tag, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  base_price: number
  stock_quantity: number
  image_url: string
  category: string
}

interface CartItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [quantities, setQuantities] = useState<{[key: string]: number}>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('http://localhost:8000/api/products/', {
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        const initialQuantities: {[key: string]: number} = {}
        data.forEach((product: Product) => {
          initialQuantities[product.id] = 1
        })
        setQuantities(initialQuantities)
      } else {
        console.error('Failed to fetch products:', response.status)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }))
  }

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1

    const existingCart = sessionStorage.getItem('cart')
    let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : []

    const existingItem = cart.find(item => item.product_id === product.id)
    
    if (existingItem) {
      cart = cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      cart.push({
        product_id: product.id,
        name: product.name,
        price: product.base_price,
        quantity: quantity,
        image_url: product.image_url
      })
    }

    sessionStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))

    // Modern success toast instead of alert
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
    toast.textContent = `Added ${quantity} x ${product.name} to cart!`
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
    
    setQuantities(prev => ({ ...prev, [product.id]: 1 }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No products available</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Discover Our Products</h2>
        <p className="text-gray-600">Premium quality items at great prices</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map(product => {
          const isLowStock = product.stock_quantity < 10 && product.stock_quantity > 0
          const isOutOfStock = product.stock_quantity === 0
          
          return (
            <div key={product.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Stock Badge */}
                {isOutOfStock && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
                {isLowStock && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Only {product.stock_quantity} left
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.category}
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Price Section */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ${product.base_price.toFixed(2)}
                    </span>
                    {/* This space is reserved for showing discounted prices with strike-through when coupons are applied */}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.stock_quantity} units available
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-4 bg-gray-50 rounded-lg p-2">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition disabled:opacity-50"
                      disabled={quantities[product.id] <= 1}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-semibold text-gray-900 w-8 text-center">
                      {quantities[product.id]}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition disabled:opacity-50"
                      disabled={quantities[product.id] >= product.stock_quantity}
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={isOutOfStock}
                  className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
