'use client'

import { useRouter } from 'next/navigation'
import { ShoppingBag, Shield, User, TrendingUp, Bot, Sparkles, Package, CheckCircle, ArrowRight, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header/Navbar */}
      <nav className="relative z-10 bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SwagCommerce
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/signin')}
                className="text-gray-700 hover:text-gray-900 font-medium transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">AI-Powered Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Bulk Merchandise
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Your premium platform for corporate swag and bulk merchandise. Get dynamic pricing, 
              instant quotes, and AI-powered analytics for smarter decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => router.push('/signup')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push('/signin')}
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </div>
          </div>

          {/* Right Visual - Feature Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 animate-slide-up" style={{animationDelay: '0.1s'}}>
                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-2">5000+</h3>
                  <p className="text-sm text-gray-600">Products Available</p>
                </div>
                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-2">Dynamic</h3>
                  <p className="text-sm text-gray-600">Bulk Pricing</p>
                </div>
              </div>
              <div className="space-y-4 mt-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-2">AI</h3>
                  <p className="text-sm text-gray-600">Smart Analytics</p>
                </div>
                <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-200/50 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-2">Instant</h3>
                  <p className="text-sm text-gray-600">Coupons</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose SwagCommerce?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining cutting-edge technology with exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Tiered Pricing',
                description: 'Automatic discounts as you order more. Better prices for bulk purchases.',
                gradient: 'from-blue-500 to-blue-600'
              },
              {
                icon: Bot,
                title: 'AI Analytics',
                description: 'Powered by Google Gemini. Get business insights in natural language.',
                gradient: 'from-purple-500 to-purple-600'
              },
              {
                icon: CheckCircle,
                title: 'Smart Coupons',
                description: 'Flexible discounts with percentage off, fixed amounts, and promotions.',
                gradient: 'from-green-500 to-green-600'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all transform hover:scale-105"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses using SwagCommerce for their merchandise needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/signup')}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create Account
              </button>
              <button
                onClick={() => router.push('/signin')}
                className="bg-purple-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-800 transition-all border-2 border-white/30"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">SwagCommerce</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted partner for bulk merchandise and corporate swag.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => router.push('/signup')} className="hover:text-white transition">Get Started</button></li>
                <li><button onClick={() => router.push('/signin')} className="hover:text-white transition">Sign In</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: hello@swagcommerce.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2026 SwagCommerce. All rights reserved.
          </div>
        </div>
      </footer>

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

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
