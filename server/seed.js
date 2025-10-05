const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = require('./config/database');

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@shop.com',
      password: 'admin123',
      role: 'admin',
      address: {
        street: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Admin Country',
      },
      phone: '+1234567890'
    });

    // Create regular users
    const regularUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer',
        address: {
          street: '456 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        phone: '+1234567891'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'customer',
        address: {
          street: '789 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
        },
        phone: '+1234567892'
      }
    ];

    await adminUser.save();
    console.log('Admin user created');

    for (const userData of regularUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log('Regular users created');

  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 2999,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ],
        category: 'electronics',
        stock: 50,
        brand: 'TechSound',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 128,
        featured: true
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance. Track your workouts and health metrics.',
        price: 8999,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500'
        ],
        category: 'electronics',
        stock: 30,
        brand: 'FitTech',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 89,
        featured: true
      },
      {
        name: 'Premium Cotton T-Shirt',
        description: 'Soft, comfortable cotton t-shirt made from 100% organic cotton. Available in multiple colors and sizes.',
        price: 899,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
        ],
        category: 'clothing',
        stock: 100,
        brand: 'EcoWear',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 67,
        featured: true
      },
      {
        name: 'Programming Fundamentals Book',
        description: 'Comprehensive guide to programming fundamentals covering multiple languages and best practices for beginners.',
        price: 1499,
        images: [
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
        ],
        category: 'books',
        stock: 75,
        brand: 'TechBooks',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 203,
        featured: true
      },
      {
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of 4 beautiful ceramic coffee mugs with ergonomic handles. Perfect for your morning coffee or tea.',
        price: 1199,
        images: [
          'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500',
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500'
        ],
        category: 'home',
        stock: 60,
        brand: 'HomeStyle',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 45,
        featured: true
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and other fitness activities.',
        price: 2399,
        images: [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
          'https://images.unsplash.com/photo-1506629905607-1b0a0a0a0a0a?w=500'
        ],
        category: 'sports',
        stock: 40,
        brand: 'FitLife',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 92,
        featured: true
      },
      {
        name: 'Organic Face Cream',
        description: 'Natural face cream with organic ingredients. Hydrates and nourishes your skin for a healthy glow.',
        price: 1799,
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=500'
        ],
        category: 'beauty',
        stock: 80,
        brand: 'NaturalBeauty',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 156,
        featured: true
      },
      {
        name: 'Educational Building Blocks',
        description: 'Colorful building blocks set for children. Encourages creativity and develops motor skills.',
        price: 1049,
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
        ],
        category: 'toys',
        stock: 90,
        brand: 'EduPlay',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 78,
        featured: true
      },
      {
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
        price: 89.99,
        images: [
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
          'https://images.unsplash.com/photo-1601972602288-dc73f7c3c8a3?w=500'
        ],
        category: 'electronics',
        stock: 25,
        brand: 'ChargeTech',
        rating: 4.0,
        numReviews: 34,
        featured: false
      },
      {
        name: 'Denim Jeans Classic',
        description: 'Classic fit denim jeans made from premium cotton. Comfortable and durable for everyday wear.',
        price: 79.99,
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
          'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500'
        ],
        category: 'clothing',
        stock: 70,
        brand: 'DenimCo',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 112,
        featured: false
      },
      {
        name: 'Cookbook: Healthy Recipes',
        description: 'Collection of 200+ healthy and delicious recipes for everyday cooking. Includes nutritional information.',
        price: 24.99,
        images: [
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
        ],
        category: 'books',
        stock: 85,
        brand: 'HealthyEats',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 89,
        featured: false
      },
      {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with multiple brightness levels and color temperatures. Perfect for work or study.',
        price: 69.99,
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
        ],
        category: 'home',
        stock: 35,
        brand: 'LightTech',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        numReviews: 56,
        featured: false
      }
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }

    console.log('Products seeded successfully');

  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    await seedUsers();
    await seedProducts();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
