'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ShoppingCart, LayoutDashboard, User, LogOut, Package, ShoppingBag, Menu, X } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      
      if (userData && token) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    }

    checkAuth()
    updateCartCount()

    // Listen for auth and cart changes
    const handleAuthChange = () => checkAuth()
    const handleCartChange = () => updateCartCount()
    
    window.addEventListener('storage', handleAuthChange)
    window.addEventListener('authChange', handleAuthChange)
    window.addEventListener('cartUpdated', handleCartChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
      window.removeEventListener('authChange', handleAuthChange)
      window.removeEventListener('cartUpdated', handleCartChange)
    }
  }, [])

  const updateCartCount = () => {
    const cart = sessionStorage.getItem('cart')
    if (cart) {
      const items = JSON.parse(cart)
      const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(total)
    } else {
      setCartCount(0)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('cart')
    setUser(null)
    setCartCount(0)
    window.dispatchEvent(new Event('authChange'))
    router.push('/signin')
  }

  const isAdmin = user?.role === 'admin'

  // Don't show navbar on signin/signup/landing pages
  const hideNavbar = pathname === '/signin' || pathname === '/signup' || (!user && pathname === '/')
  if (hideNavbar) return null

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-soft transition-shadow duration-300 hover:shadow-soft-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => router.push(isAdmin ? '/admin/ai' : '/')}
            className="text-xl font-semibold text-primary-800 hover:text-primary-700 transition-all duration-200 flex items-center gap-2 group"
          >
            <ShoppingBag className="w-6 h-6 text-accent-500 group-hover:scale-110 transition-transform duration-200" />
            <span className="hidden sm:inline">Swag Commerce</span>
            <span className="sm:hidden">Swag</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Role Badge */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 border border-purple-200 shadow-sm">
                  {isAdmin ? '👑 Admin' : '👤 Customer'}
                </div>

                {/* Admin Navigation */}
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => router.push('/admin/ai')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        pathname === '/admin/ai'
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 shadow-md border border-purple-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </button>
                  </>
                ) : (
                  /* Customer Navigation */
                  <>
                    <button
                      onClick={() => router.push('/')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        pathname === '/'
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      Products
                    </button>

                    <button
                      onClick={() => router.push('/cart')}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        pathname === '/cart'
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse shadow-lg">
                          {cartCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => router.push('/orders')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        pathname === '/orders'
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </button>
                  </>
                )}

                {/* Common Actions */}
                <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-4">
                  <button
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 px-4 py-2 rounded-lg hover:from-gray-200 hover:to-gray-100 transition-all duration-200 font-medium shadow-md hover:shadow-lg border border-gray-200"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-900 hover:to-black transition-all duration-200 font-medium shadow-md hover:shadow-xl"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              /* Guest Navigation */
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/signin')}
                  className="bg-white text-gray-800 border-2 border-gray-200 px-6 py-2 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-xl"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            {user ? (
              <div className="space-y-2">
                <div className="bg-gray-50 px-4 py-3 rounded-lg mb-3 border border-gray-200">
                  <p className="text-sm text-gray-600">Logged in as</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                  <p className="text-xs mt-1 bg-gray-200 text-gray-700 inline-block px-2 py-1 rounded">
                    {isAdmin ? '👑 Admin' : '👤 Customer'}
                  </p>
                </div>

                {isAdmin ? (
                  <button
                    onClick={() => { router.push('/admin/ai'); setMobileMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all text-left text-gray-800"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { router.push('/'); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all text-left text-gray-800"
                    >
                      <Package className="w-5 h-5" />
                      Products
                    </button>
                    <button
                      onClick={() => { router.push('/cart'); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all text-left relative text-gray-800"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-auto bg-success-500 text-white text-xs font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-1">
                          {cartCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => { router.push('/orders'); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-all text-left text-gray-800"
                    >
                      <Package className="w-5 h-5" />
                      Orders
                    </button>
                  </>
                )}

                <button
                  onClick={() => { router.push('/profile'); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all text-left text-gray-800"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => { router.push('/signin'); setMobileMenuOpen(false) }}
                  className="w-full bg-white text-gray-800 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { router.push('/signup'); setMobileMenuOpen(false) }}
                  className="w-full bg-accent-500 text-white px-4 py-3 rounded-lg hover:bg-accent-600 transition-all font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
