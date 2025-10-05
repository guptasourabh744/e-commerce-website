const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { validationResult } = require('express-validator');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../services/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { shippingAddress, paymentMethod, couponCode } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Check stock availability and prepare order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: cartItem.quantity
      });
    }

    // Calculate prices
    const itemsPrice = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Free shipping over ₹1000
    const taxPrice = itemsPrice * 0.1; // 10% tax
    let discountAmount = 0;
    let appliedCoupon = null;

    // Handle coupon if provided
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.isValid) {
        // Check user's order count for new user restrictions
        const userOrderCount = await Order.countDocuments({ user: req.user._id });
        
        if (coupon.canUserUse(req.user, userOrderCount)) {
          discountAmount = coupon.calculateDiscount(itemsPrice);
          appliedCoupon = coupon;
        }
      }
    }

    const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalPrice,
      coupon: appliedCoupon ? {
        code: appliedCoupon.code,
        discountAmount: discountAmount
      } : null
    });

    // Update product stock
    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(
        orderItem.product,
        { $inc: { stock: -orderItem.quantity } }
      );
    }

    // Update coupon usage count if coupon was applied
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(
        appliedCoupon._id,
        { $inc: { usedCount: 1 } }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Send order confirmation email (don't wait for it)
    sendOrderConfirmationEmail(req.user.email, req.user.name, order).catch(error => {
      console.error('Failed to send order confirmation email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('orderItems.product');

    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.status;
    order.status = status;
    
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send status update email if status changed and user exists
    if (oldStatus !== status && order.user && order.user.email) {
      sendOrderStatusUpdateEmail(order.user.email, order.user.name, order, status).catch(error => {
        console.error('Failed to send order status update email:', error);
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('orderItems.product');

    const total = await Order.countDocuments();

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
};
