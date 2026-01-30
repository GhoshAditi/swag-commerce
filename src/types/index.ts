export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
  category: string
  tieredPricing: TieredPrice[]
}

export interface TieredPrice {
  minQuantity: number
  price: number
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface CouponValidationResult {
  isValid: boolean
  discountType: 'percentage' | 'fixed'
  discountValue: number
  message: string
  makesFree?: boolean
}

export interface Order {
  id: string
  customerEmail: string
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
  appliedCoupon?: string
}

export interface ChatMessage {
  id: string
  message: string
  sender: 'user' | 'ai'
  timestamp: string
  isThinking?: boolean
}

export interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  topProducts: Array<{
    id: string
    name: string
    revenue: number
    quantity: number
  }>
  lowStockItems: Array<{
    id: string
    name: string
    currentStock: number
  }>
  revenueByDay: Array<{
    date: string
    revenue: number
  }>
}