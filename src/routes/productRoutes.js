import express from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  getProductsByCategory,
  searchProducts
} from '../controllers/productController.js';
import { upload } from '../middleware/upload.js';
import { createProduct } from '../controllers/productController.js';


const router = express.Router();
router.post(
  '/',
  upload.array('images', 5), // max 5 images
  createProduct
);

/**
 * @route   GET /api/products
 * @desc    Get all products with filtering
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/categories
 * @desc    Get all product categories
 * @access  Public
 */
router.get('/categories', getCategories);

/**
 * @route   GET /api/products/search
 * @desc    Search products
 * @access  Public
 */
router.get('/search', searchProducts);

/**
 * @route   GET /api/products/category/:category
 * @desc    Get products by category
 * @access  Public
 */
router.get('/category/:category', getProductsByCategory);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

export default router;

