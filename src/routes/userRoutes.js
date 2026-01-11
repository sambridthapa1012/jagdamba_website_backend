import express from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number')
  ],
  validate,
  updateUserProfile
);

/**
 * @route   GET /api/users/addresses
 * @desc    Get all user addresses
 * @access  Private
 */
router.get('/addresses', getUserAddresses);

/**
 * @route   POST /api/users/addresses
 * @desc    Create new address
 * @access  Private
 */
router.post(
  '/addresses',
  [
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('addressLine1')
      .trim()
      .notEmpty()
      .withMessage('Address line 1 is required'),
    body('city')
      .trim()
      .notEmpty()
      .withMessage('City is required'),
    body('state')
      .trim()
      .notEmpty()
      .withMessage('State is required'),
    body('postalCode')
      .trim()
      .notEmpty()
      .withMessage('Postal code is required')
  ],
  validate,
  createAddress
);

/**
 * @route   PUT /api/users/addresses/:id
 * @desc    Update address
 * @access  Private
 */
router.put(
  '/addresses/:id',
  [
    body('fullName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Full name cannot be empty'),
    body('phone')
      .optional()
      .trim()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number')
  ],
  validate,
  updateAddress
);

/**
 * @route   DELETE /api/users/addresses/:id
 * @desc    Delete address
 * @access  Private
 */
router.delete('/addresses/:id', deleteAddress);

// Admin routes
/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get('/', authorizeAdmin, getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin only)
 * @access  Private/Admin
 */
router.get('/:id', authorizeAdmin, getUserById);

export default router;

