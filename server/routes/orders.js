const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { auth, adminAuth } = require('../middlewares/auth');
const {
  createOrderValidation,
  updateOrderStatusValidation
} = require('../middlewares/validation');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, createOrderValidation, createOrder);

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, getOrder);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', auth, adminAuth, updateOrderStatusValidation, updateOrderStatus);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/admin/all', auth, adminAuth, getAllOrders);

module.exports = router;
