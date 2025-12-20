import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database connected on localhost://${conn.connection.port}`);
  } catch (error) {
    console.error("Error connecting Database", error.message);
    process.exit(1);
  }
};
