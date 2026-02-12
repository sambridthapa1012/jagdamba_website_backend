import express from "express";
import { body } from "express-validator";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin


  
} from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/adminDashboardController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validator.js";
import { upload } from "../middleware/upload.js";
import { deleteProductImage } from "../controllers/adminController.js";
import { cancelOrder, getOrderById } from "../controllers/orderController.js";
import { createInvoiceFromOrder, getInvoiceByOrderId } from "../controllers/invoiceController.js";
import { getCategories, createCategory, getCategoryById, updateCategoryById,deleteCategory } from "../controllers/categoryController.js";
//import { deleteBulkOrder } from "../controllers/bulkOrderController.js";


const router = express.Router();

/* =======================
   🔐 PROTECT ALL ADMIN ROUTES
======================= */
router.use(authenticate);
router.use(authorizeAdmin);

/* =======================
   📊 DASHBOARD
======================= */
router.get("/stats", getDashboardStats);

/* =======================
   📦 PRODUCTS
======================= */

// GET all products
router.get("/products", getAllProducts);

// GET single product (for Edit page)
router.get("/products/:id", getProductById);

// CREATE product (Cloudinary images)
router.post(
  "/products",
  upload.array("images", 5),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Invalid price"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").isInt({ min: 0 }).withMessage("Invalid stock"),
  ],
  validate,
  createProduct
);

// UPDATE product (image optional)
router.put(
  "/products/:id",
  upload.array("images", 5),
  [
    body("price").optional().isFloat({ min: 0 }),
    body("stock").optional().isInt({ min: 0 }),
  ],
  validate,
  updateProduct
);
router.delete(
  "/products/:productId/images/:publicId",
  deleteProductImage
);



// DELETE product
router.delete("/products/:id", deleteProduct);

/* =======================
   📦 ORDERS
======================= */

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);

router.put(
  "/orders/:id/status",
  [
    body("orderStatus").isIn([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]),
    body("trackingNumber").optional(),
  ],
  validate,
  updateOrderStatus
);
router.put("/orders/:id/cancel", cancelOrder);
router.delete("/orders/:id",deleteOrder)
router.get("/admin/dashboard", getDashboardStats);
/* =======================
   👤 USERS (ADMIN)
======================= */
router.post("/users", createUserByAdmin);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);
router.post(
  "/invoices/:orderId",
  createInvoiceFromOrder
);

router.get(
  "/orders/:orderId/invoice",
  getInvoiceByOrderId
);
//router.delete("/bulk-orders/:id", deleteBulkOrder);
/* =======================
   📂 CATEGORIES (ADMIN)
======================= */

router.get("/categories", getCategories);

router.post(
  "/categories",
  upload.single("image"),   // 👈 important
  createCategory
);

router.get("/categories/:id", getCategoryById);

router.put(
  "/categories/:id",
  upload.single("image"),   // 👈 important
  updateCategoryById
);

router.delete("/categories/:id", deleteCategory);



export default router;
