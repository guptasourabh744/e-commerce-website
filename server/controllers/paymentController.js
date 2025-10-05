const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_development');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { sendOrderConfirmationEmail } = require('../services/emailService');

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // Add shipping (free over ₹1000)
    const shippingPrice = totalAmount > 1000 ? 0 : 100;
    const taxPrice = totalAmount * 0.1; // 10% tax
    const finalAmount = totalAmount + shippingPrice + taxPrice;

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Convert to paise
      currency: 'inr',
      metadata: {
        userId: req.user._id.toString(),
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress)
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        amount: finalAmount
      }
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
};

// @desc    Confirm payment and create order
// @route   POST /api/payments/confirm-payment
// @access  Private
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, items, shippingAddress, couponCode } = req.body;

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Calculate prices
    const itemsPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = itemsPrice * 0.1;
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
      orderItems: items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress,
      paymentMethod: 'card',
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalPrice,
      coupon: appliedCoupon ? {
        code: appliedCoupon.code,
        discountAmount: discountAmount
      } : null,
      isPaid: true,
      paidAt: new Date()
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Update coupon usage count if coupon was applied
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(
        appliedCoupon._id,
        { $inc: { usedCount: 1 } }
      );
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    // Send order confirmation email (don't wait for it)
    sendOrderConfirmationEmail(req.user.email, req.user.name, order).catch(error => {
      console.error('Failed to send order confirmation email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Payment confirmed and order created',
      data: { order }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment'
    });
  }
};

// @desc    Create mock payment (for development)
// @route   POST /api/payments/mock-payment
// @access  Private
const createMockPayment = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;

    // Calculate prices
    const itemsPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const taxPrice = itemsPrice * 0.1;
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

    // Create order with mock payment
    const order = await Order.create({
      user: req.user._id,
      orderItems: items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.price,
        quantity: item.quantity
      })),
      shippingAddress,
      paymentMethod: 'card',
      paymentResult: {
        id: `mock_payment_${Date.now()}`,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      },
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount,
      totalPrice,
      coupon: appliedCoupon ? {
        code: appliedCoupon.code,
        discountAmount: discountAmount
      } : null,
      isPaid: true,
      paidAt: new Date()
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Update coupon usage count if coupon was applied
    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(
        appliedCoupon._id,
        { $inc: { usedCount: 1 } }
      );
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    // Send order confirmation email (don't wait for it)
    sendOrderConfirmationEmail(req.user.email, req.user.name, order).catch(error => {
      console.error('Failed to send order confirmation email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Mock payment successful and order created',
      data: { order }
    });
  } catch (error) {
    console.error('Mock payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process mock payment'
    });
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createMockPayment
};
