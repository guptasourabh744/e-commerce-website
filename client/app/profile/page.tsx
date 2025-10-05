'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Edit, Save, X, ShoppingBag, Heart, Star } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth-context';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Initialize profile data
    setProfile({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      phone: user.phone || '',
      createdAt: new Date().toISOString(),
    });

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    });
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
          <Button onClick={() => router.push('/auth/login')}>Login</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {profile?.name || 'User'}
                  </h2>
                  <p className="text-gray-600 mb-4">{profile?.email}</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {profile?.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Member since {new Date(profile?.createdAt || '').toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push('/orders')}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      My Orders
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push('/wishlist')}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      My Wishlist
                    </Button>
                    {profile?.role === 'admin' && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => router.push('/admin')}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          loading={loading}
                          disabled={loading}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          {isEditing ? (
                            <Input
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.name}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          {isEditing ? (
                            <Input
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.email}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          {isEditing ? (
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="Enter your phone number"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <Phone className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.phone || 'Not provided'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Address Information</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          {isEditing ? (
                            <Input
                              name="address.street"
                              value={formData.address.street}
                              onChange={handleInputChange}
                              placeholder="Enter street address"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.address?.street || 'Not provided'}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          {isEditing ? (
                            <Input
                              name="address.city"
                              value={formData.address.city}
                              onChange={handleInputChange}
                              placeholder="Enter city"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.address?.city || 'Not provided'}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          {isEditing ? (
                            <Input
                              name="address.state"
                              value={formData.address.state}
                              onChange={handleInputChange}
                              placeholder="Enter state"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.address?.state || 'Not provided'}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code
                          </label>
                          {isEditing ? (
                            <Input
                              name="address.zipCode"
                              value={formData.address.zipCode}
                              onChange={handleInputChange}
                              placeholder="Enter ZIP code"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.address?.zipCode || 'Not provided'}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          {isEditing ? (
                            <Input
                              name="address.country"
                              value={formData.address.country}
                              onChange={handleInputChange}
                              placeholder="Enter country"
                            />
                          ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-md">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{profile?.address?.country || 'Not provided'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
