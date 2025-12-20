import dotenv from "dotenv";
import mongoose from "mongoose";
import { Admin } from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
dotenv.config();
const name = process.env.NAME;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.log("Invalid MONGODB_URI check you .env file");
  process.exit(1);
}

export const createAdmin = async () => {
  try {
    //connect to mongo
    await mongoose.connect(MONGODB_URI);
    console.log({ success: true, message: "Connected To Mongo DB" });
    //  Existing Admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log({ success: true, message: "Admin Password Updated" });
      return;
    }

    // const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: password,
      isVerified: true,
    });
    await admin.save();
    console.log("Admin Created");
  } catch (error) {
    console.error("Error creating admin", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
