const { validationResult } = require('express-validator');
const { sendContactFormEmail } = require('../services/emailService');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Send contact form email (don't wait for it)
    sendContactFormEmail({ name, email, subject, message }).catch(error => {
      console.error('Failed to send contact form email:', error);
    });

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
};

module.exports = {
  submitContactForm
};
