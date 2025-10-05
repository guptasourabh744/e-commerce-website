const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Coupon description is required']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minimumAmount: {
    type: Number,
    default: 0,
    min: [0, 'Minimum amount cannot be negative']
  },
  maximumDiscount: {
    type: Number,
    default: null,
    min: [0, 'Maximum discount cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [1, 'Usage limit must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  userRestriction: {
    type: String,
    enum: ['all', 'new_users', 'existing_users'],
    default: 'all'
  },
  categories: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster coupon code lookups
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

// Virtual to check if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
});

// Method to check if user can use this coupon
couponSchema.methods.canUserUse = function(user, userOrderCount = 0) {
  if (!this.isValid) return false;
  
  if (this.userRestriction === 'new_users' && userOrderCount > 0) {
    return false;
  }
  
  if (this.userRestriction === 'existing_users' && userOrderCount === 0) {
    return false;
  }
  
  return true;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.minimumAmount) {
    return 0;
  }
  
  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  } else if (this.discountType === 'fixed') {
    discount = Math.min(this.discountValue, orderAmount);
  }
  
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

module.exports = mongoose.model('Coupon', couponSchema);
