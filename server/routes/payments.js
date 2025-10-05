const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  createMockPayment
} = require('../controllers/paymentController');
const { auth } = require('../middlewares/auth');
const { body } = require('express-validator');

// Payment validation
const paymentValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('shippingAddress.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Shipping name must be between 2 and 50 characters'),
  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('shippingAddress.zipCode')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Zip code must be between 3 and 10 characters'),
  body('shippingAddress.country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  body('shippingAddress.phone')
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters')
];

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', auth, paymentValidation, createPaymentIntent);

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment and create order
// @access  Private
router.post('/confirm-payment', auth, paymentValidation, confirmPayment);

// @route   POST /api/payments/mock-payment
// @desc    Create mock payment for development
// @access  Private
router.post('/mock-payment', auth, paymentValidation, createMockPayment);

module.exports = router;
