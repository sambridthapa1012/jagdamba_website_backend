import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const cancelledOrders = await Order.countDocuments({
      orderStatus: "cancelled",
    });

    const cancellationReasons = await Order.aggregate([
      { $match: { orderStatus: "cancelled", cancellationReason: { $ne: null } } },
      {
        $group: {
          _id: "$cancellationReason",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const recentCancellations = await Order.find({
      orderStatus: "cancelled",
    })
      .select("user cancellationReason cancelledAt totalPrice")
      .populate("user", "name email")
      .sort({ cancelledAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        cancelledOrders,
        cancellationReasons,
        recentCancellations,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Dashboard stats failed",
    });
  }
};
