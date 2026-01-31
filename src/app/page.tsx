'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import ProductsGrid from '../components/ProductsGrid'
import LandingPage from '../components/LandingPage'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (user && token) {
      setIsAuthenticated(true)
      const userData = JSON.parse(user)
      // Redirect admins to their dashboard
      if (userData.role === 'admin') {
        router.push('/admin/ai')
        return
      }
    }
    
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage />
  }

  // Show marketplace for authenticated customers
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProductsGrid />
    </div>
  )
}
