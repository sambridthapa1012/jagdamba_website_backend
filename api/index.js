import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../src/config/database.js";
import { errorHandler } from "../src/middleware/errorHandler.js";

// Routes
import authRoutes from "../src/routes/authRoutes.js";
import userRoutes from "../src/routes/userRoutes.js";
import productRoutes from "../src/routes/productRoutes.js";
import cartRoutes from "../src/routes/cartRoutes.js";
import orderRoutes from "../src/routes/orderRoutes.js";
import adminRoutes from "../src/routes/adminRoutes.js";
import bulkOrderRoutes from "../src/routes/bulkOrderRoutes.js";
import invoiceRoutes from "../src/routes/invoiceRoutes.js";
import categoryRoutes from "../src/routes/CategoryRoutes.js";

dotenv.config();

const app = express();

/* ============================
   🌐 MIDDLEWARE
============================ */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ============================
   🔥 CONNECT TO DATABASE
============================ */
try {
  // Top-level await ensures DB is ready before routes are registered
  await connectDB();
  console.log("✅ MongoDB connected and ready");
} catch (err) {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1); // Stop server if DB connection fails
}

/* ============================
   ❤️ HEALTH CHECK
============================ */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Jagadamba API",
  });
});

/* ============================
   🔌 API ROUTES
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bulk-orders", bulkOrderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/categories", categoryRoutes);

/* ============================
   ❌ 404 HANDLER
============================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ============================
   🚨 GLOBAL ERROR HANDLER
============================ */
app.use(errorHandler);

export default app;
