import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    const msg = 'MONGODB_URI is not defined. Please configure MongoDB Atlas.';
    console.error(msg);
    throw new Error(msg);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error instanceof Error ? error.message : error}`);
    throw error;
  }
};

export default connectDB;
