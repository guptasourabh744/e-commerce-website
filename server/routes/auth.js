const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  getAllUsers,
  updateUser
} = require('../controllers/authController');
const { auth, authorize } = require('../middlewares/auth');
const {
  registerValidation,
  loginValidation
} = require('../middlewares/validation');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, logout);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', auth, authorize('admin'), getAllUsers);

// @route   PUT /api/auth/users/:id
// @desc    Update user (Admin only)
// @access  Private/Admin
router.put('/users/:id', auth, authorize('admin'), updateUser);

module.exports = router;
