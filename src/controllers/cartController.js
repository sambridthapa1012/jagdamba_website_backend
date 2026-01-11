import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Get user's cart
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price images stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const total = cart.calculateTotal();
    const itemCount = cart.calculateItemCount();

    res.status(200).json({
      success: true,
      data: {
        cart: {
          ...cart.toObject(),
          total,
          itemCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cart'
    });
  }
};

/**
 * Add item to cart
 * POST /api/cart/items
 */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images stock');

    const total = cart.calculateTotal();
    const itemCount = cart.calculateItemCount();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        cart: {
          ...cart.toObject(),
          total,
          itemCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding item to cart'
    });
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/items/:itemId
 */
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // Check stock availability
    const product = await Product.findById(item.product);
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`
      });
    }

    item.quantity = quantity;
    await cart.save();

    await cart.populate('items.product', 'name price images stock');

    const total = cart.calculateTotal();
    const itemCount = cart.calculateItemCount();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: {
        cart: {
          ...cart.toObject(),
          total,
          itemCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating cart item'
    });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/items/:itemId
 */
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    await cart.save();

    await cart.populate('items.product', 'name price images stock');

    const total = cart.calculateTotal();
    const itemCount = cart.calculateItemCount();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: {
        cart: {
          ...cart.toObject(),
          total,
          itemCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing item from cart'
    });
  }
};

/**
 * Clear cart
 * DELETE /api/cart
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart: {
          ...cart.toObject(),
          total: 0,
          itemCount: 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error clearing cart'
    });
  }
};

