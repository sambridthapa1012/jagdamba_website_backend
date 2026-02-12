import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],

    subtotal: Number,
    tax: Number,
    shipping: Number,
    grandTotal: Number,

    status: {
      type: String,
      enum: ["paid", "unpaid", "refunded"],
      default: "unpaid",
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
