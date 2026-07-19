'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiEdit, FiTrash2, FiEye, FiCalendar, FiTag, FiBox } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  condition: string;
  description?: string;
  specifications?: string;
  images: string[];
  status: string;
  stockQuantity?: number;
  price?: number;
  currency?: string;
  partNumber?: string;
  manufacturer?: string;
  model?: string;
  yearManufactured?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        setError(data.error || 'Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push('/products?deleted=true');
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Used': return 'bg-orange-100 text-orange-800';
      case 'Refurbished': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center min-h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
              <Link 
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <FiArrowLeft className="w-5 h-5 mr-1" />
                  Back
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Product Details
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link
                  href={`/products/add?edit=${product._id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <FiEdit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
                
                {/* View on Client Site */}
                <Link
                  href={`http://localhost:3000/products/${product.slug}`}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  <FiEye className="w-4 h-4 mr-2" />
                  View on Site
                </Link>
                
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name
                    </label>
                    <p className="text-gray-900 dark:text-white">{product.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Slug
                    </label>
                    <p className="text-gray-900 dark:text-white font-mono text-sm">{product.slug}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Brand
                    </label>
                    <p className="text-gray-900 dark:text-white">{product.brand}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <p className="text-gray-900 dark:text-white">{product.category}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Condition
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(product.condition)}`}>
                      {product.condition}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    {product.specifications}
                  </div>
                </div>
              )}

              {/* Images */}
              {product.images && product.images.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Images</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/api/placeholder/200/200';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Technical Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiBox className="w-5 h-5 mr-2" />
                  Technical Details
                </h2>
                
                <div className="space-y-4">
                  {product.partNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Part Number
                      </label>
                      <p className="text-gray-900 dark:text-white font-mono text-sm">{product.partNumber}</p>
                    </div>
                  )}

                  {product.manufacturer && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Manufacturer
                      </label>
                      <p className="text-gray-900 dark:text-white">{product.manufacturer}</p>
                    </div>
                  )}

                  {product.model && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Model
                      </label>
                      <p className="text-gray-900 dark:text-white">{product.model}</p>
                    </div>
                  )}

                  {product.yearManufactured && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Year Manufactured
                      </label>
                      <p className="text-gray-900 dark:text-white">{product.yearManufactured}</p>
                    </div>
                  )}

                  {product.weight && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Weight
                      </label>
                      <p className="text-gray-900 dark:text-white">{product.weight} kg</p>
                    </div>
                  )}

                  {product.stockQuantity !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stock Quantity
                      </label>
                      <p className="text-gray-900 dark:text-white">{product.stockQuantity}</p>
                    </div>
                  )}

                  {product.price && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {product.currency || 'USD'} {product.price.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Information */}
              {(product.metaTitle || product.metaDescription) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiTag className="w-5 h-5 mr-2" />
                    SEO Information
                  </h2>
                  
                  <div className="space-y-4">
                    {product.metaTitle && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Meta Title
                        </label>
                        <p className="text-gray-900 dark:text-white text-sm">{product.metaTitle}</p>
                      </div>
                    )}

                    {product.metaDescription && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Meta Description
                        </label>
                        <p className="text-gray-900 dark:text-white text-sm">{product.metaDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  Timestamps
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created
                    </label>
                    <p className="text-gray-900 dark:text-white text-sm">{formatDate(product.createdAt)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900 dark:text-white text-sm">{formatDate(product.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}