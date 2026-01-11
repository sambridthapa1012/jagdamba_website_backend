import mongoose from 'mongoose';

/**
 * Connect to MongoDB using MONGODB_URI only
 * Fail fast if URI is missing to avoid silent local DB usage
 */
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }

    return false;
  }


};

export default connectDB;
