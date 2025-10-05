const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getSubscribers
} = require('../controllers/newsletterController');
const { auth } = require('../middlewares/auth');
const { body } = require('express-validator');

// Newsletter validation
const newsletterValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', newsletterValidation, subscribeNewsletter);

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', newsletterValidation, unsubscribeNewsletter);

// @route   GET /api/newsletter/subscribers
// @desc    Get all newsletter subscribers (Admin only)
// @access  Private/Admin
router.get('/subscribers', auth, getSubscribers);

module.exports = router;
