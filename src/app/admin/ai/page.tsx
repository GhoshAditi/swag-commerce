'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EnhancedAdminDashboard from '../../../components/EnhancedAdminDashboard'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return <EnhancedAdminDashboard />
}
