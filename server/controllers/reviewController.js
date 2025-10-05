const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { validationResult } = require('express-validator');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, orderId, rating, comment } = req.body;

    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      status: 'delivered'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not delivered yet'
      });
    }

    // Check if product exists in the order
    const orderItem = order.orderItems.find(item => item.product.toString() === productId);
    if (!orderItem) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in this order'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product for this order'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      comment
    });

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ product: productId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name images')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
};

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      await Product.findByIdAndUpdate(productId, {
        rating: parseFloat(averageRating.toFixed(1)),
        numReviews: reviews.length
      });
    }
  } catch (error) {
    console.error('Update product rating error:', error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews
};
