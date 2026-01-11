import Product from '../models/Product.js';
/**
 * Create product with image upload
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      stock,
      featured,
      specifications
    } = req.body;

    // Images from multer
    const images = req.files
      ? req.files.map(file => `/uploads/products/${file.filename}`)
      : [];
      console.log('images:', req.files);
    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
      brand,
      stock,
      featured,
      images: images || [],
      specifications
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * Get all products with filtering and pagination
 * GET /api/products
 */
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      brand,
      minPrice,
      maxPrice,
      search,
      featured,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category.toLowerCase();
    }

    if (subcategory) {
      query.subcategory = subcategory.toLowerCase();
    }

    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortBy = {};
    if (sort === 'price_low') {
      sortBy = { price: 1 };
    } else if (sort === 'price_high') {
      sortBy = { price: -1 };
    } else if (sort === 'rating') {
      sortBy = { rating: -1 };
    } else if (sort === 'newest') {
      sortBy = { createdAt: -1 };
    } else {
      sortBy = { createdAt: -1 };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products'
    });
  }
};

/**
 * Get product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product'
    });
  }
};

/**
 * Get product categories
 * GET /api/products/categories
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: { categories }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching categories'
    });
  }
};

/**
 * Get products by category
 * GET /api/products/category/:category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, sort } = req.query;

    const query = {
      category: category.toLowerCase(),
      isActive: true
    };

    let sortBy = {};
    if (sort === 'price_low') {
      sortBy = { price: 1 };
    } else if (sort === 'price_high') {
      sortBy = { price: -1 };
    } else {
      sortBy = { createdAt: -1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products by category'
    });
  }
};

/**
 * Search products
 * GET /api/products/search
 */
export const searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      });
    }

    const query = {
      $text: { $search: q },
      isActive: true
    };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      query: q,
      data: { products }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching products'
    });
  }
};

