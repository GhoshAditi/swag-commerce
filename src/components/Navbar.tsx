'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Update cart count
    updateCartCount();

    // Listen for cart updates
    const handleStorageChange = () => {
      updateCartCount();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const updateCartCount = () => {
    const cart = sessionStorage.getItem('cart');
    if (cart) {
      const items = JSON.parse(cart);
      const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    } else {
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold">
              Swag Commerce
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <button
              onClick={() => router.push('/cart')}
              className="relative bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <>
                <span className="text-sm">
                  Welcome, {user.name || user.email}
                </span>
                <a
                  href="/orders"
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition"
                >
                  Orders
                </a>
                <a
                  href="/profile"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <a
                  href="/signin"
                  className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
