import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_MONGO_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGO_URI");
}

let isConnected = false;

export const dbConnect = async (): Promise<void> => {
  if (isConnected) return;

  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  isConnected = true;
};
