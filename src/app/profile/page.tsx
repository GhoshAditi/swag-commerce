'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/signin');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <div className="space-y-4">
            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg">{user?.name || 'Not provided'}</p>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">Account Status</label>
              <p className="text-lg capitalize">
                <span className="text-green-600">{user?.status}</span>
              </p>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-lg">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div className="border-b pb-4">
              <label className="block text-sm font-medium text-gray-500">User ID</label>
              <p className="text-sm text-gray-600 font-mono">{user?.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
