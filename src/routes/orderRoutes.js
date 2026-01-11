import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrderSummary
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/orders/summary
 * @desc    Get order summary for checkout
 * @access  Private
 */
router.get('/summary', getOrderSummary);

/**
 * @route   GET /api/orders
 * @desc    Get user's orders
 * @access  Private
 */
router.get('/', getMyOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', getOrderById);

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private
 */
router.post(
  '/',
  [
    body('shippingInfo.fullName').notEmpty(),
    body('shippingInfo.phone').notEmpty(),
    body('shippingInfo.email').notEmpty(),
    body('shippingInfo.address').notEmpty(),
    body('shippingInfo.district').notEmpty(),
    body('shippingInfo.city').notEmpty(),
    body('shippingInfo.landmark').notEmpty()
  ],
  validate,
  createOrder
);


/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
router.put(
  '/:id/cancel',
  [
    body('cancellationReason')
      .optional()
      .trim()
  ],
  validate,
  cancelOrder
);

export default router;

