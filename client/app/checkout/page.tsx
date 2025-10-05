'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/auth-context';
import { useCartStore } from '@/lib/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PaymentForm } from '@/components/PaymentForm';
import { formatPrice } from '@/lib/utils';
import { couponsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CheckoutForm {
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
}

interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  minimumAmount: number;
  maximumDiscount?: number;
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { items, totalPrice } = useCartStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutForm>({
    defaultValues: {
      paymentMethod: 'cash_on_delivery',
    },
  });

  useEffect(() => {
    // Wait for auth to finish checking before deciding
    if (authLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setLoading(false);

    // Scroll to top when page loads - more robust for mobile
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      // Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Small delay to ensure page is rendered
    setTimeout(scrollToTop, 100);
  }, [user, authLoading, router]);

  useEffect(() => {
    // Pre-fill form with user data if available
    if (user) {
      if (user.address) {
        setValue('shippingAddress.name', user.name);
        setValue('shippingAddress.street', user.address.street || '');
        setValue('shippingAddress.city', user.address.city || '');
        setValue('shippingAddress.state', user.address.state || '');
        setValue('shippingAddress.zipCode', user.address.zipCode || '');
        setValue('shippingAddress.country', user.address.country || '');
        setValue('shippingAddress.phone', user.phone || '');
      } else {
        setValue('shippingAddress.name', user.name);
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data: CheckoutForm) => {
    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }

    setShowPayment(true);
    
    // Scroll to top when showing payment form - more robust for mobile
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      // Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  const handlePaymentSuccess = (order: any) => {
    router.push(`/orders/${order._id}`);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    
    // Scroll to top when cancelling payment - more robust for mobile
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      // Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const response = await couponsAPI.validateCoupon({
        code: couponCode.trim(),
        orderAmount: totalPrice
      });

      setAppliedCoupon(response.data.data.coupon);
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to apply coupon';
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  // Calculate totals with coupon discount
  const calculateTotals = () => {
    const itemsPrice = totalPrice;
    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = (itemsPrice - (appliedCoupon?.discountAmount || 0)) * 0.1;
    const discountAmount = appliedCoupon?.discountAmount || 0;
    const finalTotal = itemsPrice + shippingPrice + taxPrice - discountAmount;

    return {
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      total: Math.max(0, finalTotal) // Ensure total is not negative
    };
  };

  const totals = calculateTotals();

  // While auth check is in progress, or local loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
                <div className="h-24 sm:h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-80 sm:h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4 mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="h-48 sm:h-64 bg-gray-200 rounded"></div>
                <div className="h-24 sm:h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-80 sm:h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Button onClick={() => router.push('/products')} className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600 text-sm sm:text-base">Complete your order</p>
        </div>

        {!showPayment ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Checkout Form */}
            <div className="space-y-4 sm:space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    error={errors.shippingAddress?.name?.message}
                    {...register('shippingAddress.name', {
                      required: 'Full name is required',
                    })}
                  />
                  
                  <Input
                    label="Street Address"
                    placeholder="Enter your street address"
                    error={errors.shippingAddress?.street?.message}
                    {...register('shippingAddress.street', {
                      required: 'Street address is required',
                    })}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                      label="City"
                      placeholder="Enter your city"
                      error={errors.shippingAddress?.city?.message}
                      {...register('shippingAddress.city', {
                        required: 'City is required',
                      })}
                    />
                    
                    <Input
                      label="State"
                      placeholder="Enter your state"
                      error={errors.shippingAddress?.state?.message}
                      {...register('shippingAddress.state', {
                        required: 'State is required',
                      })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="ZIP Code"
                      placeholder="Enter your ZIP code"
                      error={errors.shippingAddress?.zipCode?.message}
                      {...register('shippingAddress.zipCode', {
                        required: 'ZIP code is required',
                      })}
                    />
                    
                    <Input
                      label="Country"
                      placeholder="Enter your country"
                      error={errors.shippingAddress?.country?.message}
                      {...register('shippingAddress.country', {
                        required: 'Country is required',
                      })}
                    />
                  </div>
                  
                  <Input
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    error={errors.shippingAddress?.phone?.message}
                    {...register('shippingAddress.phone', {
                      required: 'Phone number is required',
                    })}
                  />
                </CardContent>
              </Card>

            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="border-t pt-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Coupon Code</h3>
                    
                    {!appliedCoupon ? (
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="px-4"
                        >
                          {couponLoading ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              {appliedCoupon.code} Applied
                            </p>
                            <p className="text-xs text-green-600">
                              {appliedCoupon.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-800">
                              -{formatPrice(appliedCoupon.discountAmount)}
                            </p>
                            <button
                              type="button"
                              onClick={handleRemoveCoupon}
                              className="text-xs text-green-600 hover:text-green-800 underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(totals.itemsPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {totals.shippingPrice === 0 ? 'Free' : formatPrice(totals.shippingPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatPrice(totals.taxPrice)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span className="font-medium">-{formatPrice(totals.discountAmount)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-semibold">
                          {formatPrice(totals.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                  >
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
        ) : (
          <div className="max-w-2xl mx-auto">
            <PaymentForm
              shippingAddress={watch('shippingAddress')}
              appliedCoupon={appliedCoupon}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
