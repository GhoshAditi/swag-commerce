'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Plus, Minus } from 'lucide-react'

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
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('http://localhost:8000/api/products/', {
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        // Initialize quantities
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

    // Get existing cart from session storage
    const existingCart = sessionStorage.getItem('cart')
    let cart: CartItem[] = existingCart ? JSON.parse(existingCart) : []

    // Check if product already in cart
    const existingItem = cart.find(item => item.product_id === product.id)
    
    if (existingItem) {
      // Update quantity
      cart = cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      // Add new item
      cart.push({
        product_id: product.id,
        name: product.name,
        price: product.base_price,
        quantity: quantity,
        image_url: product.image_url
      })
    }

    // Save to session storage
    sessionStorage.setItem('cart', JSON.stringify(cart))

    // Dispatch custom event to update cart count
    window.dispatchEvent(new Event('cartUpdated'))

    // Show success message
    alert(`Added ${quantity} x ${product.name} to cart!`)
    
    // Reset quantity to 1
    setQuantities(prev => ({ ...prev, [product.id]: 1 }))
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading products...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products available</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Products</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">${product.base_price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    disabled={quantities[product.id] <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-medium w-8 text-center">{quantities[product.id]}</span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    disabled={quantities[product.id] >= product.stock_quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock_quantity === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
