const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { auth, adminAuth } = require('../middlewares/auth');
const { body } = require('express-validator');

// Coupon validation middleware
const couponValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Coupon code can only contain uppercase letters and numbers'),
  body('description')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Description must be between 5 and 200 characters'),
  body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either percentage or fixed'),
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  body('minimumAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum amount must be a positive number'),
  body('maximumDiscount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount must be a positive number'),
  body('validUntil')
    .isISO8601()
    .withMessage('Valid until must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Valid until date must be in the future');
      }
      return true;
    }),
  body('usageLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),
  body('userRestriction')
    .optional()
    .isIn(['all', 'new_users', 'existing_users'])
    .withMessage('User restriction must be all, new_users, or existing_users')
];

// Validate coupon code validation
const validateCouponValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required'),
  body('orderAmount')
    .isFloat({ min: 0 })
    .withMessage('Order amount must be a positive number')
];

// @route   POST /api/coupons/validate
// @desc    Validate coupon code
// @access  Private
router.post('/validate', auth, validateCouponValidation, validateCoupon);

// @route   GET /api/coupons
// @desc    Get all coupons (Admin)
// @access  Private/Admin
router.get('/', auth, adminAuth, getAllCoupons);

// @route   POST /api/coupons
// @desc    Create new coupon (Admin)
// @access  Private/Admin
router.post('/', auth, adminAuth, couponValidation, createCoupon);

// @route   PUT /api/coupons/:id
// @desc    Update coupon (Admin)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, couponValidation, updateCoupon);

// @route   DELETE /api/coupons/:id
// @desc    Delete coupon (Admin)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, deleteCoupon);

module.exports = router;
