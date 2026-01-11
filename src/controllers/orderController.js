import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

/**
 * Create new order
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { shippingInfo, paymentMethod = 'cash_on_delivery' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate all items are in stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product ${product?.name || 'Unknown'} is out of stock or insufficient quantity`
        });
      }
    }

    // Calculate prices
    const itemsPrice = cart.calculateTotal();
    const shippingPrice = itemsPrice > 1000 ? 0 : 50; // Free shipping above 1000
    const taxPrice = itemsPrice * 0.18; // 18% GST
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images[0] || ''
    }));

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingInfo,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      orderStatus: 'pending'
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order details
    await order.populate('user', 'name email');
    await order.populate('orderItems.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order'
    });
  }
};

/**
 * Get user's orders
 * GET /api/orders
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders'
    });
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user or user is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order'
    });
  }
};

/**
 * Cancel order
 * PUT /api/orders/:id/cancel
 */
export const cancelOrder = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.orderStatus}`
      });
    }

    // Update order status
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    if (cancellationReason) {
      order.cancellationReason = cancellationReason;
    }

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling order'
    });
  }
};

/**
 * Get order summary (for checkout)
 * GET /api/orders/summary
 */
export const getOrderSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate prices
    const itemsPrice = cart.calculateTotal();
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const taxPrice = itemsPrice * 0.18;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          itemCount: cart.calculateItemCount()
        },
        cart: cart.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order summary'
    });
  }
};

