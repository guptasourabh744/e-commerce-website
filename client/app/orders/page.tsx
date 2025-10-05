'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Eye, Calendar, DollarSign } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth-context';
import { ordersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
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
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusIcons = {
  pending: '⏳',
  processing: '📦',
  shipped: '🚚',
  delivered: '✅',
  cancelled: '❌',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNext: false,
    hasPrev: false,
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
  }, [user, router, currentPage]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders({ page: currentPage, limit: 10 });
      const data: OrdersResponse = response.data.data;
      
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your orders
          </p>
        </div>

        {orders.length > 0 ? (
          <>
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}
                        >
                          {statusIcons[order.status]} {statusLabels[order.status]}
                        </span>
                        <Link href={`/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                        <div className="space-y-2">
                          {order.orderItems.slice(0, 3).map((item) => (
                            <div key={item._id} className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                    No img
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity} × ₹{item.price}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.orderItems.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{order.orderItems.length - 3} more items
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>
                              {order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice.toLocaleString('en-IN')}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>₹{order.taxPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Package className="h-4 w-4 mr-2" />
                            <span>
                              {order.paymentMethod === 'cash_on_delivery' 
                                ? 'Cash on Delivery' 
                                : order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)
                              }
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {order.isDelivered 
                                ? `Delivered on ${formatDate(order.deliveredAt!)}`
                                : order.status === 'shipped'
                                ? 'Shipped'
                                : 'Processing'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
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
