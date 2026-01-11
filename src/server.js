import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB then start server
// startServer is called once DB connection completes (or if skipping DB)
connectDB()
  .then((connected) => {
    if (connected) {
      startServer(PORT);
    } else if (process.env.SKIP_DB === 'true' || process.env.NODE_ENV !== 'production') {
      // If SKIP_DB is set, or not production, continue starting server to assist development
      startServer(PORT);
    } else {
      console.error('Failed to connect to DB — server will not start in production mode.');
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Unexpected error while connecting to DB:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));



// Start server with error handling for EADDRINUSE
const PORT = parseInt(process.env.PORT, 10) || 5000;

/**
 * Start the Express server on the given port. If the port is in use, try the next one.
 * This helps local development when a previous instance is still running.
 */
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
      // Wait a short time and try the next port
      setTimeout(() => startServer(port + 1), 1000);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

// Keep startServer call in case `connectDB()` isn't used in certain flows — we call it above.

export default app;

