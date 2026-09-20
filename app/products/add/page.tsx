'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiUpload, FiX, FiPlus } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import toast from 'react-hot-toast';

const conditions = ['Used', 'Refurbished', 'New'];

const statuses = ['Draft', 'Published'];

interface Specification {
  id: string;
  field: string;
  value: string;
}

function ProductFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([
    { id: '1', field: 'Model', value: '' },
    { id: '2', field: 'Power', value: '' },
    { id: '3', field: 'RPM', value: '' },
    { id: '4', field: 'Year', value: '' },
    { id: '5', field: 'Serial Number', value: '' },
  ]);
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState('Draft');

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const result = await response.json();

      console.log('Fetched product:', result.data); // Debug log

      if (result.success) {
        const product = result.data;
        console.log('Product category:', product.category); // Debug
        console.log('Product brand:', product.brand); // Debug
        console.log('Product condition:', product.condition); // Debug

        setProductName(product.name);
        setSlug(product.slug);
        setCategory(product.category);
        setBrand(product.brand);

        // Capitalize condition to match form values (Used, Refurbished, New)
        const capitalizedCondition = product.condition
          ? product.condition.charAt(0).toUpperCase() + product.condition.slice(1).toLowerCase()
          : '';
        console.log('Capitalized condition:', capitalizedCondition); // Debug
        setCondition(capitalizedCondition);

        // Map description to shortDescription
        setShortDescription(product.description || '');
        setFullDescription(''); // We don't have fullDescription anymore

        // Map images array to featured and gallery
        if (product.images && product.images.length > 0) {
          setFeaturedImage(product.images[0]);
          setGalleryImages(product.images.slice(1));
        }

        // Parse specifications string into array
        if (product.specifications && typeof product.specifications === 'string') {
          const specsArray = product.specifications.split('\n').map((line: string, idx: number) => {
            const [field, ...valueParts] = line.split(':');
            return {
              id: idx.toString(),
              field: field?.trim() || '',
              value: valueParts.join(':').trim() || ''
            };
          }).filter((spec: Specification) => spec.field && spec.value);

          if (specsArray.length > 0) {
            setSpecifications(specsArray);
          }
        }

        setSeoTitle(product.metaTitle || '');
        setMetaDescription(product.metaDescription || '');

        // Map status from database format to UI format
        // Database: 'active', 'inactive', 'draft'
        // UI: 'Published', 'Draft'
        if (product.status === 'active') {
          setStatus('Published');
        } else {
          setStatus('Draft');
        }
      } else {
        toast.error('Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
    }
  };

  // Generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProductName(name);
    setSlug(generateSlug(name));
  };

  // Specifications handlers
  const addSpecification = () => {
    const newSpec: Specification = {
      id: Date.now().toString(),
      field: '',
      value: '',
    };
    setSpecifications([...specifications, newSpec]);
  };

  const updateSpecification = (id: string, field: 'field' | 'value', value: string) => {
    setSpecifications(
      specifications.map((spec) =>
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    );
  };

  const removeSpecification = (id: string) => {
    setSpecifications(specifications.filter((spec) => spec.id !== id));
  };

  // Drag and drop specifications
  const moveSpecification = (index: number, direction: 'up' | 'down') => {
    const newSpecs = [...specifications];
    if (direction === 'up' && index > 0) {
      [newSpecs[index - 1], newSpecs[index]] = [newSpecs[index], newSpecs[index - 1]];
    } else if (direction === 'down' && index < newSpecs.length - 1) {
      [newSpecs[index + 1], newSpecs[index]] = [newSpecs[index], newSpecs[index + 1]];
    }
    setSpecifications(newSpecs);
  };

  // Image handlers
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data.url;
  };

  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const url = await uploadImage(e.target.files[0]);
        setFeaturedImage(url);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploading(true);
      try {
        const files = Array.from(e.target.files);
        const uploadPromises = files.map(file => uploadImage(file));
        const urls = await Promise.all(uploadPromises);
        setGalleryImages([...galleryImages, ...urls]);
        toast.success('Images uploaded successfully');
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload images');
      } finally {
        setUploading(false);
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...galleryImages];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    setGalleryImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !category || !brand || !condition) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Combine featured image and gallery images
      const allImages = featuredImage ? [featuredImage, ...galleryImages] : galleryImages;

      // Create specifications string from array
      const specificationsText = specifications
        .filter(spec => spec.field && spec.value)
        .map(spec => `${spec.field}: ${spec.value}`)
        .join('\n');

      const productData = {
        name: productName,
        slug,
        category,
        brand,
        condition,
        description: shortDescription,
        specifications: specificationsText,
        images: allImages,
        status: status.toLowerCase() === 'published' ? 'active' : 'draft',
        metaTitle: seoTitle,
        metaDescription,
      };

      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(productId ? 'Product updated successfully' : 'Product created successfully');
        router.push('/products');
      } else {
        toast.error(result.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => router.push('/products')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <FiArrowLeft /> Back to Products
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {productId ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={handleProductNameChange}
                      placeholder="MAN B&W 6L40/54 Engine"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Slug (auto-generated)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="man-bw-6l40-54-engine"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Engine"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. MAN B&W"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Condition *
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    {conditions.map((cond) => (
                      <label key={cond} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="condition"
                          value={cond}
                          checked={condition === cond}
                          onChange={(e) => setCondition(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          required
                        />
                        <span className="text-gray-700 dark:text-gray-300">{cond}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Description</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Description
                  </label>
                  <textarea
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Images</h2>
              <div className="space-y-6">
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Featured Image
                  </label>
                  {featuredImage ? (
                    <div className="relative inline-block">
                      <img
                        src={featuredImage}
                        alt="Featured"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setFeaturedImage('')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {uploading ? (
                        <span className="text-sm text-gray-500">Uploading...</span>
                      ) : (
                        <>
                          <FiUpload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gallery Images
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {galleryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(index, 'up')}
                              className="p-1 bg-white rounded text-gray-800 hover:bg-gray-100"
                            >
                              ↑
                            </button>
                          )}
                          {index < galleryImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveGalleryImage(index, 'down')}
                              className="p-1 bg-white rounded text-gray-800 hover:bg-gray-100"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {uploading ? (
                        <span className="text-xs text-gray-500">...</span>
                      ) : (
                        <>
                          <FiPlus className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryImagesChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Technical Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiPlus /> Add Row
                </button>
              </div>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={spec.id} className="flex gap-3 items-start">
                    <input
                      type="text"
                      value={spec.field}
                      onChange={(e) => updateSpecification(spec.id, 'field', e.target.value)}
                      placeholder="Field"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="flex gap-1 pt-1">
                      <button
                        type="button"
                        onClick={() => moveSpecification(index, 'up')}
                        disabled={index === 0}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSpecification(index, 'down')}
                        disabled={index === specifications.length - 1}
                        className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSpecification(spec.id)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="MAN B&W 6L40/54 Engine - Used Marine Engine"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    placeholder="High quality used MAN B&W 6L40/54 marine engine. 4320 KW, 550 RPM, manufactured in 2012..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Status</h2>
              <div className="flex gap-4">
                {statuses.map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={status === s}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : productId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function ProductFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><span className="text-gray-500">Loading...</span></div>}>
      <ProductFormInner />
    </Suspense>
  );
}
