'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiPackage, FiCheckCircle, FiFileText, FiMail, FiTrendingUp, FiClock } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  inactiveProducts: number;
  totalInquiries: number;
  recentlyAddedProducts: Array<{
    id: string;
    name: string;
    category: string;
    date: string;
  }>;
  recentInquiries?: Array<{
    id: string;
    name: string;
    email: string;
    product: string;
    message: string;
    date: string;
  }>;
  productsByCategory: Array<{
    _id: string;
    count: number;
  }>;
  productsByBrand: Array<{
    _id: string;
    count: number;
  }>;
}

// Dummy data for inquiries and views (since we don't have these tables yet)
const mockData = {
  recentInquiries: [
    { id: 1, name: 'John Doe', email: 'john@example.com', product: 'Marine Engine', date: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', product: 'Navigation System', date: '5 hours ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', product: 'Safety Equipment', date: '1 day ago' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', product: 'Marine GPS', date: '1 day ago' },
  ],
  mostViewedProducts: [
    { id: 1, name: 'High Performance Engine', views: 1250, category: 'Engines' },
    { id: 2, name: 'Advanced Navigation', views: 980, category: 'Electronics' },
    { id: 3, name: 'Safety Kit Pro', views: 850, category: 'Safety' },
    { id: 4, name: 'Marine Radar System', views: 720, category: 'Electronics' },
    { id: 5, name: 'Propeller Set', views: 680, category: 'Parts' },
  ],
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchDashboardStats}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <button
              onClick={() => router.push('/products')}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 text-left hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalProducts || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <FiPackage className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Products</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.activeProducts || 0}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <FiCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Draft Products</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.draftProducts || 0}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <FiFileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalInquiries || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <FiMail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Data Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Inquiries */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <FiMail className="w-6 h-6 text-gray-600 dark:text-gray-300 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Inquiries</h2>
                <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">Live</span>
              </div>
              <div className="space-y-4">
                {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
                  stats.recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{inquiry.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Product: <span className="font-medium text-slate-800 dark:text-slate-200">{inquiry.product}</span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">{inquiry.date}</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{inquiry.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-900/40 p-2.5 rounded border border-gray-150 dark:border-gray-700/50 leading-relaxed italic">
                        &quot;{inquiry.message}&quot;
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No inquiries received yet
                  </div>
                )}
              </div>
            </div>

            {/* Most Viewed Products */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <FiTrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-300 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Most Viewed Products</h2>
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Demo Data</span>
              </div>
              <div className="space-y-4">
                {mockData.mostViewedProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{product.views}</p>
                      <p className="text-xs text-gray-400">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Added Products */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2">
              <div className="flex items-center mb-6">
                <FiClock className="w-6 h-6 text-gray-600 dark:text-gray-300 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recently Added Products</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {stats?.recentlyAddedProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                    <p className="text-xs text-gray-400 mt-2">{product.date}</p>
                  </div>
                )) || (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No products added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}