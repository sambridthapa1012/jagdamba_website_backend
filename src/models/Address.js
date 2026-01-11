import mongoose from 'mongoose';

/**
 * Address Schema
 * Stores shipping and billing addresses for users
 */
const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['shipping', 'billing', 'both'],
      default: 'shipping'
    },
    fullName: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true
    },
    addressLine1: {
      type: String,
      required: [true, 'Please provide address line 1'],
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Please provide postal code'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Please provide country'],
      trim: true,
      default: 'India'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
addressSchema.index({ user: 1 });

const Address = mongoose.model('Address', addressSchema);

export default Address;

