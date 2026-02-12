import express from "express";
import {
  createBulkOrder,
  getAllBulkOrders,
  updateBulkOrderStatus,
  deleteBulkOrder
} from "../controllers/bulkOrderController.js";

const router = express.Router();

// Public – Submit bulk order
router.post("/", createBulkOrder);

// Admin – View all bulk orders
router.get("/", getAllBulkOrders);

// Admin – Update status
router.put("/:id", updateBulkOrderStatus);
router.delete("/:id", deleteBulkOrder);


export default router;
