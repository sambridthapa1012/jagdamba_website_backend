import mongoose from 'mongoose';

/**
 * Cart Item Schema
 * Embedded schema for cart items
 */
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
});

/**
 * Cart Schema
 * Stores user shopping cart with items
 */
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema]
  },
  {
    timestamps: true
  }
);

/**
 * Calculate total price of cart
 */
cartSchema.methods.calculateTotal = function () {
  return this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

/**
 * Calculate total items in cart
 */
cartSchema.methods.calculateItemCount = function () {
  return this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

