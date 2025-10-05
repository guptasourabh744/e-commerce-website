'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/AdminRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Settings, 
  Save, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Truck,
  Database,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currency: string;
  timezone: string;
  language: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  customerSupport: boolean;
  marketingEmails: boolean;
}

interface PaymentSettings {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  codEnabled: boolean;
  upiEnabled: boolean;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  shippingZones: string[];
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<StoreSettings>({
    defaultValues: {
      storeName: 'My E-commerce Store',
      storeEmail: 'guptasourabh744@gmail.com',
      storePhone: '+91 7023159912',
      storeAddress: {
        street: '123 Business Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      language: 'en'
    }
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerSupport: true,
    marketingEmails: false
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripeEnabled: true,
    paypalEnabled: false,
    codEnabled: true,
    upiEnabled: true
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 1000,
    standardShippingCost: 100,
    expressShippingCost: 200,
    shippingZones: ['India', 'International']
  });

  const onSubmit = async (data: StoreSettings) => {
    setLoading(true);
    try {
      // Mock API call - in real implementation, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePaymentChange = (key: keyof PaymentSettings) => {
    setPaymentSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your store configuration and preferences</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'general' && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Store Name"
                        {...register('storeName', { required: 'Store name is required' })}
                        error={errors.storeName?.message}
                      />
                      <Input
                        label="Store Email"
                        type="email"
                        {...register('storeEmail', { required: 'Store email is required' })}
                        error={errors.storeEmail?.message}
                      />
                    </div>
                    <Input
                      label="Store Phone"
                      {...register('storePhone', { required: 'Store phone is required' })}
                      error={errors.storePhone?.message}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Street Address"
                        {...register('storeAddress.street', { required: 'Street address is required' })}
                        error={errors.storeAddress?.street?.message}
                      />
                      <Input
                        label="City"
                        {...register('storeAddress.city', { required: 'City is required' })}
                        error={errors.storeAddress?.city?.message}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="State"
                        {...register('storeAddress.state', { required: 'State is required' })}
                        error={errors.storeAddress?.state?.message}
                      />
                      <Input
                        label="Zip Code"
                        {...register('storeAddress.zipCode', { required: 'Zip code is required' })}
                        error={errors.storeAddress?.zipCode?.message}
                      />
                      <Input
                        label="Country"
                        {...register('storeAddress.country', { required: 'Country is required' })}
                        error={errors.storeAddress?.country?.message}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Currency
                        </label>
                        <select
                          {...register('currency')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timezone
                        </label>
                        <select
                          {...register('timezone')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Language
                        </label>
                        <select
                          {...register('language')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ta">Tamil</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button type="submit" loading={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                          {key === 'orderNotifications' && 'Get notified when new orders are placed'}
                          {key === 'lowStockAlerts' && 'Alert when product stock is running low'}
                          {key === 'customerSupport' && 'Notifications for customer support requests'}
                          {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleNotificationChange(key as keyof NotificationSettings)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(paymentSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {key === 'stripeEnabled' && 'Accept payments via Stripe (Credit/Debit cards)'}
                          {key === 'paypalEnabled' && 'Accept payments via PayPal'}
                          {key === 'codEnabled' && 'Cash on Delivery payment option'}
                          {key === 'upiEnabled' && 'UPI payment integration'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handlePaymentChange(key as keyof PaymentSettings)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Free Shipping Threshold (₹)"
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings(prev => ({
                        ...prev,
                        freeShippingThreshold: Number(e.target.value)
                      }))}
                    />
                    <Input
                      label="Standard Shipping Cost (₹)"
                      type="number"
                      value={shippingSettings.standardShippingCost}
                      onChange={(e) => setShippingSettings(prev => ({
                        ...prev,
                        standardShippingCost: Number(e.target.value)
                      }))}
                    />
                  </div>
                  <Input
                    label="Express Shipping Cost (₹)"
                    type="number"
                    value={shippingSettings.expressShippingCost}
                    onChange={(e) => setShippingSettings(prev => ({
                      ...prev,
                      expressShippingCost: Number(e.target.value)
                    }))}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-medium text-yellow-800">Security Notice</h4>
                    </div>
                    <p className="text-sm text-yellow-700 mt-2">
                      For security reasons, some settings can only be changed by contacting support.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        Add an extra layer of security to your admin account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">API Keys</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        Manage your API keys for third-party integrations
                      </p>
                      <Button variant="outline">Manage API Keys</Button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Login History</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        View recent login attempts and sessions
                      </p>
                      <Button variant="outline">View Login History</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
