import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable in .env.local");
}

/**
 * Global is used here to maintain a cached connection
 * across hot reloads in development. This prevents
 * connections growing exponentially.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };
    
    console.log("Connecting to MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then((mongoose) => {
        console.log("✅ MongoDB Connected");
        
        // Enable debugging in development
        if (process.env.NODE_ENV !== 'production') {
          mongoose.set('debug', true);
        }
        
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;