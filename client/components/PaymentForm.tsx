'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { paymentsAPI } from '@/lib/api';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  shippingAddress: any;
  appliedCoupon?: {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    minimumAmount: number;
    maximumDiscount?: number;
  } | null;
  onSuccess: (order: any) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  shippingAddress,
  appliedCoupon,
  onSuccess,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState('mock');
  const [processing, setProcessing] = useState(false);
  const { items, totalPrice, clearCart } = useCartStore();

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
      total: Math.max(0, finalTotal)
    };
  };

  const totals = calculateTotals();

  const handlePayment = async () => {
    if (!items.length) {
      toast.error('Cart is empty');
      return;
    }

    setProcessing(true);
    try {
      const orderData = {
        items: items.map(item => ({
          product: {
            _id: item.product._id,
            name: item.product.name,
            images: item.product.images
          },
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        couponCode: appliedCoupon?.code || null
      };

      let response;
      if (paymentMethod === 'mock') {
        response = await paymentsAPI.createMockPayment(orderData);
      } else {
        // For real Stripe integration, you would:
        // 1. Create payment intent
        // 2. Use Stripe Elements
        // 3. Confirm payment
        response = await paymentsAPI.createMockPayment(orderData);
      }

      const order = response.data.data.order;
      clearCart();
      toast.success('Payment successful!');
      onSuccess(order);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Payment failed';
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              value="mock"
              checked={paymentMethod === 'mock'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <div>
              <div className="font-medium">Mock Payment (Development)</div>
              <div className="text-sm text-gray-500">Simulate payment for testing</div>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
            <input
              type="radio"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-primary-600 focus:ring-primary-500"
              disabled
            />
            <div>
              <div className="font-medium">Credit/Debit Card (Stripe)</div>
              <div className="text-sm text-gray-500">Secure payment with Stripe (Coming Soon)</div>
            </div>
          </label>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
          <div className="space-y-3">
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
                <span className="text-lg font-semibold">{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            className="flex-1"
            loading={processing}
            disabled={processing}
          >
            {paymentMethod === 'mock' ? 'Complete Mock Payment' : 'Pay with Stripe'}
          </Button>
        </div>

        {paymentMethod === 'mock' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">ℹ</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-900">Mock Payment Mode</h4>
                <p className="text-sm text-blue-700 mt-1">
                  This is a development mode. The payment will be simulated and an order will be created immediately.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
