const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { auth } = require('../middlewares/auth');
const {
  addToCartValidation,
  updateCartItemValidation
} = require('../middlewares/validation');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, getCart);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', auth, addToCartValidation, addToCart);

// @route   PUT /api/cart/items/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/items/:itemId', auth, updateCartItemValidation, updateCartItem);

// @route   DELETE /api/cart/items/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:itemId', auth, removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', auth, clearCart);

module.exports = router;
