const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@shop.com',
      to: userEmail,
      subject: 'Welcome to Shop!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Shop, ${userName}!</h2>
          <p>Thank you for registering with us. We're excited to have you as part of our community!</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our amazing products</li>
            <li>Add items to your wishlist</li>
            <li>Track your orders</li>
            <li>Enjoy exclusive deals and offers</li>
          </ul>
          <p>Happy shopping!</p>
          <p>Best regards,<br>The Shop Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@shop.com',
      to: userEmail,
      subject: `Order Confirmation - Order #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Thank you for your order! We've received your order and are processing it.</p>
          
          <h3>Order Details:</h3>
          <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalPrice.toLocaleString('en-IN')}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          
          <h3>Items Ordered:</h3>
          <ul>
            ${order.orderItems.map(item => `
              <li>${item.name} - Qty: ${item.quantity} - ₹${item.price.toLocaleString('en-IN')}</li>
            `).join('')}
          </ul>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with us!</p>
          <p>Best regards,<br>The Shop Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send newsletter subscription confirmation
const sendNewsletterConfirmationEmail = async (email) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@shop.com',
      to: email,
      subject: 'Newsletter Subscription Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Newsletter Subscription Confirmed!</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll now receive:</p>
          <ul>
            <li>Latest product updates</li>
            <li>Exclusive deals and discounts</li>
            <li>Seasonal promotions</li>
            <li>New arrivals notifications</li>
          </ul>
          <p>We promise not to spam you and you can unsubscribe at any time.</p>
          <p>Happy shopping!</p>
          <p>Best regards,<br>The Shop Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Newsletter confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending newsletter confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send contact form email
const sendContactFormEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@shop.com',
      to: process.env.EMAIL_TO || process.env.ADMIN_EMAIL || 'admin@shop.com',
      subject: `Contact Form Submission from ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Subject:</strong> ${formData.subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${formData.message.replace(/\n/g, '<br>')}
          </div>
          <p>Please respond to this inquiry as soon as possible.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact form email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, error: error.message };
  }
};

// Send order status update email
const sendOrderStatusUpdateEmail = async (userEmail, userName, order, newStatus) => {
  try {
    const transporter = createTransporter();
    
    const statusMessages = {
      'pending': 'Your order is being processed',
      'processing': 'Your order is being prepared',
      'shipped': 'Your order has been shipped',
      'delivered': 'Your order has been delivered',
      'cancelled': 'Your order has been cancelled'
    };
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@shop.com',
      to: userEmail,
      subject: `Order Status Update - Order #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Dear ${userName},</p>
          <p>Your order status has been updated:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${order.totalPrice.toLocaleString('en-IN')}</p>
            <p><strong>New Status:</strong> <span style="color: #007bff; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
          </div>
          
          <p><strong>Status Message:</strong> ${statusMessages[newStatus] || 'Your order status has been updated'}</p>
          
          ${newStatus === 'shipped' ? `
            <p>Your order is on its way! You can track your package using the order ID above.</p>
          ` : ''}
          
          ${newStatus === 'delivered' ? `
            <p>Thank you for your order! We hope you enjoy your purchase. If you have any questions or concerns, please don't hesitate to contact us.</p>
          ` : ''}
          
          <p>Thank you for shopping with us!</p>
          <p>Best regards,<br>The Shop Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order status update email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order status update email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendNewsletterConfirmationEmail,
  sendContactFormEmail,
  sendOrderStatusUpdateEmail
};
