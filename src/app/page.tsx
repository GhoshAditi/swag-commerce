'use client'

import { useState } from 'react'
import { ShoppingBag, User, BarChart3, Bot, ArrowRight, Package, TrendingUp, Sparkles, CheckCircle } from 'lucide-react'
import Marketplace from '../components/Marketplace'
import AdminDashboard from '../components/AdminDashboard'
import Navbar from '../components/Navbar'
import ProductsGrid from '../components/ProductsGrid'

export default function Home() {
  const [activeView, setActiveView] = useState<'home' | 'marketplace' | 'admin'>('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 to-beige-100">
      {/* Navbar */}
      <Navbar />
      
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-beige-300/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-primary-900 tracking-tight">
                  SwagCommerce
                </span>
                <p className="text-xs text-primary-600">Bulk Merchandise Platform</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('home')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  activeView === 'home'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-primary-900 hover:bg-beige-200'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveView('marketplace')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                  activeView === 'marketplace'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-primary-900 hover:bg-beige-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Marketplace</span>
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                  activeView === 'admin'
                    ? 'bg-accent-600 text-white shadow-md'
                    : 'text-primary-900 hover:bg-beige-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {activeView === 'home' && <HomePage onNavigate={setActiveView} />}
        {activeView === 'marketplace' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ProductsGrid />
          </div>
        )}
        {activeView === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-primary-900 text-beige-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SwagCommerce</span>
              </div>
              <p className="text-beige-300 text-sm">
                Your trusted partner for bulk corporate merchandise and swag. Powered by AI analytics.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-beige-300">
                <li><button onClick={() => setActiveView('marketplace')} className="hover:text-accent-400">Marketplace</button></li>
                <li><button onClick={() => setActiveView('admin')} className="hover:text-accent-400">Admin Dashboard</button></li>
                <li><a href="#about" className="hover:text-accent-400">About Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-beige-300">
                <li>Email: hello@swagcommerce.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <span>AI-Powered Analytics</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-beige-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-beige-400">© 2026 SwagCommerce. All rights reserved.</p>
            <p className="text-sm text-beige-400">Built with Next.js & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HomePage({ onNavigate }: { onNavigate: (view: 'marketplace' | 'admin') => void }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-accent-100 text-accent-800 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Analytics</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-900 mb-6 leading-tight">
                Bulk Merchandise
                <span className="block bg-gradient-to-r from-accent-600 to-accent-500 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              <p className="text-xl text-primary-700 mb-8 leading-relaxed">
                Your one-stop platform for corporate swag and promotional merchandise. 
                Get dynamic pricing, instant quotes, and intelligent analytics for data-driven decisions.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="group bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  <span>Browse Marketplace</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('admin')}
                  className="bg-white hover:bg-beige-100 text-primary-900 px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg border border-beige-300 transition-all"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-400/20 to-primary-400/20 rounded-3xl blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 animate-slide-in-left">
                  <div className="glass p-6 rounded-2xl hover-lift">
                    <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-primary-900 mb-2">5000+</h3>
                    <p className="text-sm text-primary-700">Products Available</p>
                  </div>
                  <div className="glass p-6 rounded-2xl hover-lift">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-primary-900 mb-2">Dynamic</h3>
                    <p className="text-sm text-primary-700">Bulk Pricing</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8 animate-slide-in-right">
                  <div className="glass p-6 rounded-2xl hover-lift">
                    <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mb-4">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-primary-900 mb-2">AI Assistant</h3>
                    <p className="text-sm text-primary-700">Smart Analytics</p>
                  </div>
                  <div className="glass p-6 rounded-2xl hover-lift">
                    <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-primary-900 mb-2">Instant</h3>
                    <p className="text-sm text-primary-700">Coupon System</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4">
              Why Choose SwagCommerce?
            </h2>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto">
              We combine cutting-edge technology with exceptional service to deliver 
              the best bulk merchandise experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Dynamic Pricing',
                description: 'Get better prices as you order more. Our tiered pricing system rewards bulk purchases automatically.',
                color: 'primary'
              },
              {
                icon: Bot,
                title: 'AI Analytics',
                description: 'Powered by Google Gemini AI. Ask questions about inventory, revenue, and trends in natural language.',
                color: 'accent'
              },
              {
                icon: CheckCircle,
                title: 'Smart Coupons',
                description: 'Flexible coupon system with percentage discounts, fixed amounts, and special promotions.',
                color: 'success'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="glass p-8 rounded-2xl hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-3">{feature.title}</h3>
                <p className="text-primary-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold text-primary-900 mb-6">
                Built for Scale, Designed for Simplicity
              </h2>
              <p className="text-lg text-primary-700 mb-8">
                Whether you're ordering 10 items or 10,000, our platform handles it all 
                with ease. Real-time inventory tracking, automated pricing, and instant quotes.
              </p>
              <ul className="space-y-4">
                {[
                  'Real-time inventory management',
                  'Automatic tiered pricing calculations',
                  'Advanced coupon validation system',
                  'Comprehensive order history',
                  'AI-powered business insights'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="text-primary-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass p-8 rounded-2xl animate-fade-in">
              <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="mb-6 text-beige-100">
                  Browse our marketplace or access the admin dashboard to see powerful analytics in action.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('marketplace')}
                    className="w-full bg-white text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-beige-100 transition-all"
                  >
                    Explore Products
                  </button>
                  <button
                    onClick={() => onNavigate('admin')}
                    className="w-full bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-all"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}