'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, ShoppingBag, Mail, Lock, UserCircle, Sparkles } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    tier: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Sign up failed');
      }

      // Store token and user data with selected role
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({ ...data.user, role: userType }));

      // Redirect based on role
      if (userType === 'admin') {
        router.push('/admin/ai');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <ShoppingBag className="w-16 h-16 animate-bounce" />
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Join SwagCommerce</h1>
            <p className="text-blue-100 text-lg mb-8">
              Start your journey with the most advanced merchandise platform
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 transform hover:translate-x-2 transition-transform">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <span className="text-2xl">🎯</span>
                </div>
                <span>Smart tiered pricing system</span>
              </div>
              <div className="flex items-center space-x-3 transform hover:translate-x-2 transition-transform">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <span className="text-2xl">📊</span>
                </div>
                <span>Real-time analytics dashboard</span>
              </div>
              <div className="flex items-center space-x-3 transform hover:translate-x-2 transition-transform">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <span className="text-2xl">🤖</span>
                </div>
                <span>AI-powered insights</span>
              </div>
              <div className="flex items-center space-x-3 transform hover:translate-x-2 transition-transform">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <span className="text-2xl">🚀</span>
                </div>
                <span>Lightning-fast checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-lg bg-opacity-90">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600 mb-8">Join us today and start shopping</p>

          {/* User Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              I want to sign up as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  userType === 'user'
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <User className={`w-10 h-10 mb-2 transition-colors ${userType === 'user' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${userType === 'user' ? 'text-blue-600' : 'text-gray-600'}`}>
                  Customer
                </span>
                <span className="text-xs text-gray-500 mt-1">Shop products</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  userType === 'admin'
                    ? 'border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <Shield className={`w-10 h-10 mb-2 transition-colors ${userType === 'admin' ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className={`font-semibold ${userType === 'admin' ? 'text-purple-600' : 'text-gray-600'}`}>
                  Admin
                </span>
                <span className="text-xs text-gray-500 mt-1">Manage store</span>
              </button>
            </div>
          </div>
        
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2 animate-shake">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <UserCircle className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-400"
                placeholder="John Doe"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-400"
                placeholder="your@email.com"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-400"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-300 flex items-center justify-center space-x-2 ${
                userType === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Create {userType === 'admin' ? 'Admin' : 'Customer'} Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/signin')}
                className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
