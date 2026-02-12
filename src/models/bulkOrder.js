import mongoose from "mongoose";

const bulkOrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    company: {
      type: String,
      trim: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "contacted", "quoted", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BulkOrder", bulkOrderSchema);
