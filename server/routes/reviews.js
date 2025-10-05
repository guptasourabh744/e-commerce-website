const express = require('express');
const router = express.Router();
const {
  createReview,
  getProductReviews,
  getUserReviews
} = require('../controllers/reviewController');
const { auth } = require('../middlewares/auth');
const { body } = require('express-validator');

// Review validation
const reviewValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  body('orderId')
    .isMongoId()
    .withMessage('Valid order ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// @route   POST /api/reviews
// @desc    Create a review
// @access  Private
router.post('/', auth, reviewValidation, createReview);

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', getProductReviews);

// @route   GET /api/reviews/user
// @desc    Get user's reviews
// @access  Private
router.get('/user', auth, getUserReviews);

module.exports = router;
