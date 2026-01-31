'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfessionalAdminDashboard from '../../../components/ProfessionalAdminDashboard'
import Navbar from '../../../components/Navbar'

export default function AdminAIPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and is admin
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/signin')
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== 'admin') {
      router.push('/')
      return
    }

    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <ProfessionalAdminDashboard />
    </>
  )
}
