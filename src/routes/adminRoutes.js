import express from 'express';
import { body } from 'express-validator';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorizeAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
router.get('/stats', getDashboardStats);

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (Admin)
 * @access  Private/Admin
 */
router.get('/products', getAllProducts);

/**
 * @route   POST /api/admin/products
 * @desc    Create product (Admin)
 * @access  Private/Admin
 */
router.post(
  '/products',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 200 })
      .withMessage('Product name cannot exceed 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Product description is required'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
  ],
  validate,
  createProduct
);

/**
 * @route   PUT /api/admin/products/:id
 * @desc    Update product (Admin)
 * @access  Private/Admin
 */
router.put(
  '/products/:id',
  [
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
  ],
  validate,
  updateProduct
);

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product (Admin)
 * @access  Private/Admin
 */
router.delete('/products/:id', deleteProduct);

/**
 * @route   GET /api/admin/orders
 * @desc    Get all orders (Admin)
 * @access  Private/Admin
 */
router.get('/orders', getAllOrders);

/**
 * @route   PUT /api/admin/orders/:id/status
 * @desc    Update order status (Admin)
 * @access  Private/Admin
 */
router.put(
  '/orders/:id/status',
  [
    body('orderStatus')
      .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid order status'),
    body('trackingNumber')
      .optional()
      .trim()
  ],
  validate,
  updateOrderStatus
);

export default router;

