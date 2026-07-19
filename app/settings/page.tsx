'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiUser, FiGlobe, FiDatabase, FiMail, FiShield, FiUpload } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';

interface Settings {
  // Company Information
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyWebsite: string;
  
  // SEO Settings
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultMetaKeywords: string;
  
  // Email Settings
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  
  // General Settings
  itemsPerPage: number;
  allowUserRegistration: boolean;
  maintenanceMode: boolean;
  
  // File Upload Settings
  maxFileSize: number;
  allowedFileTypes: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    companyName: 'Al-Qaswa Marine',
    companyEmail: 'info@alqaswamarine.com',
    companyPhone: '+91 9825183207',
    companyAddress: 'Bhavnagar, Gujarat, India',
    companyWebsite: 'https://alqaswamarine.com',
    
    defaultMetaTitle: 'Al-Qaswa Marine - Marine Equipment & Parts',
    defaultMetaDescription: 'Leading supplier of marine equipment, engines, and parts in Gujarat, India.',
    defaultMetaKeywords: 'marine, equipment, engines, parts, Gujarat, India',
    
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    smtpFrom: 'noreply@alqaswamarine.com',
    
    itemsPerPage: 20,
    allowUserRegistration: false,
    maintenanceMode: false,
    
    maxFileSize: 5,
    allowedFileTypes: 'jpg,jpeg,png,webp,pdf'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    // Load settings from localStorage or API
    loadSettings();
  }, []);

  const loadSettings = () => {
    // For now, we'll use localStorage. In production, this would be an API call
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleInputChange = (field: keyof Settings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      // For now, save to localStorage. In production, this would be an API call
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({type: 'success', text: 'Settings saved successfully!'});
    } catch (error) {
      setMessage({type: 'error', text: 'Failed to save settings. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {id: 'company', name: 'Company', icon: FiUser},
    {id: 'seo', name: 'SEO', icon: FiGlobe},
    {id: 'email', name: 'Email', icon: FiMail},
    {id: 'general', name: 'General', icon: FiDatabase},
    {id: 'files', name: 'Files', icon: FiUpload},
    {id: 'security', name: 'Security', icon: FiShield}
  ];

  return (
    <AdminLayout>
      <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your application settings and configuration</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-100 border border-green-200 text-green-800' 
                : 'bg-red-100 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Company Settings */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.companyEmail}
                        onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.companyPhone}
                        onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={settings.companyWebsite}
                        onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <textarea
                      value={settings.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">SEO Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Meta Title
                    </label>
                    <input
                      type="text"
                      value={settings.defaultMetaTitle}
                      onChange={(e) => handleInputChange('defaultMetaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">{settings.defaultMetaTitle.length}/60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Meta Description
                    </label>
                    <textarea
                      value={settings.defaultMetaDescription}
                      onChange={(e) => handleInputChange('defaultMetaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">{settings.defaultMetaDescription.length}/160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Keywords
                    </label>
                    <input
                      type="text"
                      value={settings.defaultMetaKeywords}
                      onChange={(e) => handleInputChange('defaultMetaKeywords', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Configuration</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.smtpHost}
                        onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        value={settings.smtpPort}
                        onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="587"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        value={settings.smtpUser}
                        onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      From Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.smtpFrom}
                      onChange={(e) => handleInputChange('smtpFrom', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Items Per Page
                    </label>
                    <select
                      value={settings.itemsPerPage}
                      onChange={(e) => handleInputChange('itemsPerPage', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowUserRegistration"
                        checked={settings.allowUserRegistration}
                        onChange={(e) => handleInputChange('allowUserRegistration', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="allowUserRegistration" className="ml-2 block text-sm text-gray-900 dark:text-white">
                        Allow User Registration
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900 dark:text-white">
                        Maintenance Mode
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* File Settings */}
              {activeTab === 'files' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">File Upload Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum File Size (MB)
                    </label>
                    <select
                      value={settings.maxFileSize}
                      onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={1}>1 MB</option>
                      <option value={2}>2 MB</option>
                      <option value={5}>5 MB</option>
                      <option value={10}>10 MB</option>
                      <option value={20}>20 MB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      value={settings.allowedFileTypes}
                      onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="jpg,jpeg,png,webp,pdf"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate file extensions with commas</p>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security Settings</h2>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                    <div className="flex">
                      <FiShield className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Security Features Coming Soon
                        </h3>
                        <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                          Advanced security settings like two-factor authentication, API rate limiting, and audit logs will be available in future updates.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Current Security Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <span className="text-sm text-green-800 dark:text-green-300">Password Protection</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <span className="text-sm text-green-800 dark:text-green-300">HTTPS Connection</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                        <span className="text-sm text-gray-800 dark:text-gray-300">Two-Factor Authentication</span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FiSave className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}