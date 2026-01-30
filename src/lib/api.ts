// API Base URL - update this when backend is deployed
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Product API
export const productAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      // Return mock data as fallback
      return getMockProducts()
    }
  },

  getById: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }
}

// Coupon API
export const couponAPI = {
  validate: async (code: string, cartItems: any[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartItems })
      })
      if (!response.ok) throw new Error('Failed to validate coupon')
      return await response.json()
    } catch (error) {
      console.error('Error validating coupon:', error)
      // Return mock validation
      return getMockCouponValidation(code)
    }
  }
}

// Order API
export const orderAPI = {
  create: async (orderData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })
      if (!response.ok) throw new Error('Failed to create order')
      return await response.json()
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`)
      if (!response.ok) throw new Error('Failed to fetch orders')
      return await response.json()
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }
}

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return getMockAnalytics()
    }
  }
}

// AI Chat API
export const aiAPI = {
  sendMessage: async (message: string, context: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      })
      if (!response.ok) throw new Error('Failed to send message')
      return await response.json()
    } catch (error) {
      console.error('Error sending AI message:', error)
      return { response: generateMockAIResponse(message) }
    }
  }
}

// Mock data fallbacks
function getMockProducts() {
  return [
    {
      id: '1',
      name: 'Premium Company T-Shirt',
      description: 'High-quality cotton t-shirt with company logo',
      price: 25.00,
      stock: 150,
      image: 'https://via.placeholder.com/300x300/8b6f47/ffffff?text=T-Shirt',
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
      image: 'https://via.placeholder.com/300x300/ff9640/ffffff?text=Bottle',
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
    },
    {
      id: '5',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with custom branding',
      price: 45.00,
      stock: 120,
      image: 'https://via.placeholder.com/300x300/c19a6b/ffffff?text=Mouse',
      category: 'Tech',
      tieredPricing: [
        { minQuantity: 1, price: 45.00 },
        { minQuantity: 20, price: 42.00 },
        { minQuantity: 50, price: 40.00 },
      ]
    },
    {
      id: '6',
      name: 'Canvas Tote Bag',
      description: 'Eco-friendly canvas tote with screen printing',
      price: 12.00,
      stock: 300,
      image: 'https://via.placeholder.com/300x300/a87d4f/ffffff?text=Tote',
      category: 'Bags',
      tieredPricing: [
        { minQuantity: 1, price: 12.00 },
        { minQuantity: 30, price: 10.00 },
        { minQuantity: 100, price: 8.00 },
      ]
    }
  ]
}

function getMockCouponValidation(code: string) {
  if (code === 'SUMMER50') {
    return {
      isValid: true,
      discountType: 'percentage',
      discountValue: 50,
      message: '50% off applied!',
      makesFree: false
    }
  } else if (code === 'FREESHIP') {
    return {
      isValid: true,
      discountType: 'fixed',
      discountValue: 0,
      message: 'Free shipping applied!',
      makesFree: true
    }
  }
  return {
    isValid: false,
    discountType: 'fixed',
    discountValue: 0,
    message: 'Invalid coupon code',
    makesFree: false
  }
}

function getMockAnalytics() {
  return {
    totalRevenue: 45250.00,
    totalOrders: 127,
    topProducts: [
      { id: '1', name: 'Premium Company T-Shirt', revenue: 18750, quantity: 750 },
      { id: '2', name: 'Branded Water Bottle', revenue: 12600, quantity: 840 },
      { id: '3', name: 'Custom Laptop Stickers', revenue: 8960, quantity: 1120 },
    ],
    lowStockItems: [
      { id: '4', name: 'Executive Notebook', currentStock: 15 },
      { id: '1', name: 'Premium Company T-Shirt', currentStock: 25 },
    ],
    revenueByDay: [
      { date: '2026-01-23', revenue: 5200 },
      { date: '2026-01-24', revenue: 6100 },
      { date: '2026-01-25', revenue: 7300 },
      { date: '2026-01-26', revenue: 8200 },
      { date: '2026-01-27', revenue: 6800 },
      { date: '2026-01-28', revenue: 9100 },
      { date: '2026-01-29', revenue: 8500 },
    ]
  }
}

function generateMockAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('revenue') || lowerQuery.includes('sales')) {
    return 'Total revenue is currently $45,250 from 127 orders. The revenue trend is positive with strong growth!'
  } else if (lowerQuery.includes('stock') || lowerQuery.includes('inventory')) {
    return 'Executive Notebook has the lowest stock with only 15 units remaining. I recommend restocking soon!'
  } else if (lowerQuery.includes('product') || lowerQuery.includes('selling')) {
    return 'Premium Company T-Shirt is our top performer with $18,750 in revenue from 750 units sold.'
  }
  
  return 'I can help you analyze revenue trends, inventory levels, and product performance. What would you like to know?'
}

export { getMockProducts, getMockAnalytics }