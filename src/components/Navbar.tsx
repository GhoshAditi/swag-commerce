'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ShoppingCart, LayoutDashboard, User, LogOut, Package, ShoppingBag, Menu, X } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    updateCartCount()

    const handleStorageChange = () => {
      updateCartCount()
    }
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
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
    router.push('/signin')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="text-2xl font-bold hover:opacity-90 transition flex items-center gap-2"
          >
            <ShoppingBag className="w-7 h-7" />
            <span className="hidden sm:inline">Swag Commerce</span>
            <span className="sm:hidden">Swag</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Role Badge */}
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                  {isAdmin ? '👑 Admin' : '👤 Customer'}
                </div>

                {/* Admin Navigation */}
                {isAdmin ? (
                  <>
                    <button
                      onClick={() => router.push('/admin/ai')}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition font-medium"
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
                      className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition font-medium"
                    >
                      <Package className="w-4 h-4" />
                      Products
                    </button>

                    <button
                      onClick={() => router.push('/cart')}
                      className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition font-medium"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                          {cartCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => router.push('/orders')}
                      className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-lg transition font-medium"
                    >
                      <Package className="w-4 h-4" />
                      Orders
                    </button>
                  </>
                )}

                {/* Common Actions */}
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              /* Guest Navigation */
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/signin')}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            {user ? (
              <div className="space-y-2">
                <div className="bg-white/10 px-4 py-2 rounded-lg mb-3">
                  <p className="text-sm opacity-75">Logged in as</p>
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-xs mt-1 bg-white/20 inline-block px-2 py-1 rounded">
                    {isAdmin ? '👑 Admin' : '👤 Customer'}
                  </p>
                </div>

                {isAdmin ? (
                  <button
                    onClick={() => { router.push('/admin/ai'); setMobileMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition text-left"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { router.push('/'); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition text-left"
                    >
                      <Package className="w-5 h-5" />
                      Products
                    </button>
                    <button
                      onClick={() => { router.push('/cart'); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition text-left relative"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Cart
                      {cartCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => { router.push('/orders'); setMobileMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition text-left"
                    >
                      <Package className="w-5 h-5" />
                      Orders
                    </button>
                  </>
                )}

                <button
                  onClick={() => { router.push('/profile'); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition text-left"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 rounded-lg hover:bg-red-600 transition text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => { router.push('/signin'); setMobileMenuOpen(false) }}
                  className="w-full bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { router.push('/signup'); setMobileMenuOpen(false) }}
                  className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
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
