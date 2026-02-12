import BulkOrder from "../models/bulkorder.js";

/**
 * @desc   Create new bulk order request
 * @route  POST /api/bulk-orders
 * @access Public
 */
export const createBulkOrder = async (req, res) => {
  try {
    const { customerName, phone, email, company, products, message } = req.body;

    if (!customerName || !phone || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const bulkOrder = await BulkOrder.create({
      customerName,
      phone,
      email,
      company,
      products: products.map((p) => ({
        product: p.productId,
        quantity: p.quantity,
      })),
      message,
    });

    res.status(201).json({
      success: true,
      message: "Bulk order request submitted successfully",
      data: bulkOrder,
    });
  } catch (error) {
    console.error("Bulk Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating bulk order",
    });
  }
};

/**
 * @desc   Get all bulk orders (Admin)
 * @route  GET /api/bulk-orders
 * @access Admin
 */
export const getAllBulkOrders = async (req, res) => {
  try {
    const bulkOrders = await BulkOrder.find()
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bulkOrders.length,
      data: bulkOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bulk orders",
    });
  }
};

/**
 * @desc   Update bulk order status
 * @route  PUT /api/bulk-orders/:id
 * @access Admin
 */
export const updateBulkOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const bulkOrder = await BulkOrder.findById(req.params.id);

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: "Bulk order not found",
      });
    }

    bulkOrder.status = status || bulkOrder.status;
    await bulkOrder.save();

    res.status(200).json({
      success: true,
      message: "Bulk order status updated",
      data: bulkOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update bulk order",
    });
  }
};
/**
 * @desc   Delete bulk order
 * @route  DELETE /api/bulk-orders/:id
 * @access Admin
 */
export const deleteBulkOrder = async (req, res) => {
  try {
    const bulkOrder = await BulkOrder.findById(req.params.id);

    if (!bulkOrder) {
      return res.status(404).json({
        success: false,
        message: "Bulk order not found",
      });
    }

    await bulkOrder.deleteOne();

    res.status(200).json({
      success: true,
      message: "Bulk order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Bulk Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete bulk order",
    });
  }
};
