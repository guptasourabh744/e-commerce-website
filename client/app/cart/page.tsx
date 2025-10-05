'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth-context';
import { useCartStore } from '@/lib/store';
import { cartAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const [updating, setUpdating] = useState<string | null>(null);
  const { user } = useAuth();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart, syncWithServer } = useCartStore();

  useEffect(() => {
    // Sync with server if user is logged in
    if (user) {
      syncWithServer();
    }
  }, [user, syncWithServer]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      // Update local store
      updateQuantity(itemId, newQuantity);
      
      // Sync with server if logged in
      if (user) {
        await cartAPI.updateCartItem(itemId, { quantity: newQuantity });
      }
      
      toast.success('Cart updated');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      // Update local store
      removeItem(itemId);
      
      // Sync with server if logged in
      if (user) {
        await cartAPI.removeFromCart(itemId);
      }
      
      toast.success('Item removed from cart');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
    } finally {
      setUpdating(null);
    }
  };

  const handleClearCart = async () => {
    try {
      // Update local store
      clearCart();
      
      // Sync with server if logged in
      if (user) {
        await cartAPI.clearCart();
      }
      
      toast.success('Cart cleared');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <Card key={item._id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="flex justify-center sm:justify-start">
                        <Link href={`/products/${item.product._id}`}>
                          <Image
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            width={100}
                            height={100}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                          />
                        </Link>
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <Link href={`/products/${item.product._id}`}>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-2xl font-bold text-primary-600 mt-2">
                          {formatPrice(item.price)}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              disabled={updating === item._id || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              disabled={updating === item._id}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(item._id)}
                            disabled={updating === item._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-center sm:text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Clear Cart Button */}
              <div className="flex justify-center sm:justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  className="text-red-600 border-red-600 hover:bg-red-50 w-full sm:w-auto"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {totalPrice > 1000 ? 'Free' : '₹100'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">
                        {formatPrice(totalPrice * 0.1)}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-semibold">
                          {formatPrice(totalPrice + (totalPrice > 1000 ? 0 : 100) + (totalPrice * 0.1))}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {user ? (
                    <Link href="/checkout" className="block">
                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <Link href="/auth/login" className="block">
                        <Button className="w-full" size="lg">
                          Sign In to Checkout
                        </Button>
                      </Link>
                      <p className="text-sm text-gray-500 text-center">
                        Sign in to save your cart and proceed to checkout
                      </p>
                    </div>
                  )}
                  
                  <Link href="/products" className="block mt-4">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}