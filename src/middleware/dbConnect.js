// middleware/dbConnect.js
import connectDB from "../config/database.js";

export const dbConnectMiddleware = async (req, res, next) => {
  try {
    await connectDB(); // ensure DB connection before handling request
    next();
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }
};
