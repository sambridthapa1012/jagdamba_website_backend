// import mongoose from 'mongoose';

// /**
//  * Connect to MongoDB using MONGODB_URI only
//  * Fail fast if URI is missing to avoid silent local DB usage
//  */
// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGODB_URI;

//     if (!uri) {
//       throw new Error('MONGODB_URI is not defined in environment variables');
//     }

//     const conn = await mongoose.connect(uri);

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     return true;
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);

//     if (process.env.NODE_ENV === 'production') {
//       process.exit(1);
//     }

//     return false;
//   }


// };

// export default connectDB;
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI is not defined");
  }

  // If connection already exists, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
