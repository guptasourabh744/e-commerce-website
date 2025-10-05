const Newsletter = require('../models/Newsletter');
const { sendNewsletterConfirmationEmail } = require('../services/emailService');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Email is already subscribed to our newsletter'
      });
    }

    // Create new subscription
    const subscriber = await Newsletter.create({ email });

    // Send confirmation email (don't wait for it)
    sendNewsletterConfirmationEmail(email).catch(error => {
      console.error('Failed to send newsletter confirmation email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: { subscriber }
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOneAndDelete({ email });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter'
    });
  }
};

// @desc    Get all newsletter subscribers (Admin only)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: { subscribers }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers'
    });
  }
};

module.exports = {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getSubscribers
};
