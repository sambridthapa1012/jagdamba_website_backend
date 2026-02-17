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
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ============================
   🚨 GLOBAL ERROR HANDLER
============================ */
app.use(errorHandler);

/* ============================
   🗄️ CONNECT DB & START SERVER
============================ */
const startServer = async () => {
  try {
    await connectDB(); // <-- wait for MongoDB to fully connect
    console.log("✅ MongoDB is ready");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB", err);
  }
};

startServer();

export default app;
