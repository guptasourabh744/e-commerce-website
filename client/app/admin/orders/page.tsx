'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminRoute } from '@/components/AdminRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { 
  Eye, 
  Package, 
  Truck, 
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
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
  user: {
    _id: string;
    name: string;
    email: string;
  };
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

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
];

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }
    
    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    if (user && user.role === 'admin') {
      fetchOrders();
    }
  }, [user, loading, router]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAllOrders({ limit: 1000 });
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
      closeModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.icon : Clock;
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage customer orders and track their status</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search orders by ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <Card key={order._id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {order.user?.name} ({order.user?.email})
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                          {statusOptions.find(opt => opt.value === order.status)?.label}
                        </span>
                      </div>
                    </div>
                    
                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Order Date</p>
                        <p className="font-medium text-sm sm:text-base">{formatDate(order.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Total Amount</p>
                        <p className="font-medium text-base sm:text-lg">{formatPrice(order.totalPrice)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Items</p>
                        <p className="font-medium text-sm sm:text-base">{order.orderItems.length} item(s)</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openOrderModal(order)}
                        className="w-full sm:w-auto"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No orders have been placed yet'
              }
            </p>
          </div>
        )}

        {/* Order Details Modal */}
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={`Order #${selectedOrder?._id.slice(-8).toUpperCase()}`}
          size="xl"
        >
          {selectedOrder && (
            <div className="space-y-4 sm:space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Order Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Customer Information</h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.user.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Information</h4>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <p><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {statusOptions.find(opt => opt.value === selectedOrder.status)?.label}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Shipping Address</h4>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="font-medium text-sm sm:text-base">{selectedOrder.shippingAddress.name}</p>
                  <p className="text-xs sm:text-sm">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-xs sm:text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p className="text-xs sm:text-sm">{selectedOrder.shippingAddress.country}</p>
                  <p className="mt-2 text-xs sm:text-sm"><span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Items</h4>
                <div className="space-y-2 sm:space-y-3">
                  {selectedOrder.orderItems.map((item) => (
                    <div key={item._id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 border rounded-lg">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm sm:text-base">{item.name}</h5>
                          <p className="text-xs sm:text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-medium text-sm sm:text-base">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Summary</h4>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-1 sm:space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedOrder.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Shipping:</span>
                    <span>{selectedOrder.shippingPrice === 0 ? 'Free' : formatPrice(selectedOrder.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Tax:</span>
                    <span>{formatPrice(selectedOrder.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-sm sm:text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(selectedOrder.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Update Order Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.value}
                        variant={selectedOrder.status === option.value ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => updateOrderStatus(selectedOrder._id, option.value)}
                        disabled={selectedOrder.status === option.value}
                        className="flex flex-col items-center space-y-1 h-auto py-2 sm:py-3 w-full"
                      >
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">{option.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center sm:justify-end pt-3 sm:pt-4">
                <Button variant="outline" onClick={closeModal} className="w-full sm:w-auto">
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
