import Invoice from "../models/invoice.js";
import Order from "../models/Order.js";

export const createInvoiceFromOrder = async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) return res.status(404).json({ message: "Order not found" });

  const exists = await Invoice.findOne({ order: order._id });
  if (exists) return res.status(400).json({ message: "Invoice already exists" });

  const invoice = await Invoice.create({
    order: order._id,
    invoiceNumber: `INV-${Date.now()}`,
    customer: {
      name: order.shippingInfo.fullName,
      email: order.shippingInfo.email,
      phone: order.shippingInfo.phone,
      address: order.shippingInfo.address,
    },
    items: order.orderItems.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity,
    })),
    subtotal: order.itemsPrice,
    tax: order.taxPrice,
    shipping: order.shippingPrice,
    grandTotal: order.totalPrice,
    status: order.isPaid ? "paid" : "unpaid",
  });

  res.json({ success: true, data: invoice });
};
/**
 * @desc   Get single invoice by ID
 * @route  GET /api/invoices/:id
 * @access Admin
 */
export const getInvoiceByOrderId = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ order: req.params.orderId })
      .populate("order");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found for this order",
      });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoice",
    });
  }
};
