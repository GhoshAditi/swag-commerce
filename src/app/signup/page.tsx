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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-stretch">
        {/* Left side - Branding */}
        <div className="hidden md:flex md:flex-col">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl h-full flex flex-col justify-center">
            <ShoppingBag className="w-16 h-16 mb-6" />
            <h1 className="text-4xl font-bold mb-4">SwagCommerce</h1>
            <p className="text-blue-100 text-lg mb-8">
              Your premium bulk merchandise platform with intelligent business insights
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <span>Tiered pricing for bulk orders</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span>Advanced analytics dashboard</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <span>AI-powered business assistant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
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

            {/* Tier Selection - Only for Customers */}
            {userType === 'user' && (
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Your Tier:
                </label>
                <p className="text-xs text-gray-600 mb-3">Higher tiers unlock better pricing on bulk orders</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: 1 })}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.tier === 1
                        ? 'border-green-500 bg-green-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <span className={`text-2xl mb-1 ${formData.tier === 1 ? 'scale-110' : ''}`}>🥉</span>
                    <span className={`font-semibold text-sm ${formData.tier === 1 ? 'text-green-600' : 'text-gray-600'}`}>
                      Tier 1
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Basic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: 2 })}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.tier === 2
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <span className={`text-2xl mb-1 ${formData.tier === 2 ? 'scale-110' : ''}`}>🥈</span>
                    <span className={`font-semibold text-sm ${formData.tier === 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                      Tier 2
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Standard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tier: 3 })}
                    className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-300 ${
                      formData.tier === 3
                        ? 'border-yellow-500 bg-yellow-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <span className={`text-2xl mb-1 ${formData.tier === 3 ? 'scale-110' : ''}`}>🥇</span>
                    <span className={`font-semibold text-sm ${formData.tier === 3 ? 'text-yellow-600' : 'text-gray-600'}`}>
                      Tier 3
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Premium</span>
                  </button>
                </div>
              </div>
            )}

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