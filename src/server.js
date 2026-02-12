import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bulkOrderRoutes from "./routes/bulkOrderRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";  
import categoryRoutes from "./routes/CategoryRoutes.js";




// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

/* ============================
   🌐 GLOBAL MIDDLEWARE
============================ */

// CORS
app.use(cors());

// Increase body size for Cloudinary uploads
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
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/invoices",invoiceRoutes);
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
   🚀 START SERVER
============================ */
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  server.on("error", (err) => {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  });
};

/* ============================
   🗄️ CONNECT DB & START
============================ */
connectDB()
  .then((connected) => {
    if (
      connected ||
      process.env.SKIP_DB === "true" ||
      process.env.NODE_ENV !== "production"
    ) {
      startServer(PORT);
    } else {
      console.error("❌ DB connection failed. Server not started.");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("❌ Unexpected DB error:", err);
    process.exit(1);
  });

export default app;
