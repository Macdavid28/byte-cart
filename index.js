import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { connectDb } from "./server/config/connectDb.js";
import { authRoutes } from "./server/routes/auth.routes.js";
import { productRoutes } from "./server/routes/product.routes.js";
import { adminRoute } from "./server/routes/admin.routes.js";
import { userRoutes } from "./server/routes/user.routes.js";
import { couponRoutes } from "./server/routes/coupon.routes.js";
import { categoryRoutes } from "./server/routes/category.routes.js";
import { authLimit, generalLimit } from "./server/middleware/ratelimit.js";
import { cartRoutes } from "./server/routes/cart.routes.js";
dotenv.config();
const app = express();
const authLimiter = authLimit;
const globalLimiter = generalLimit;

const whiteList = [
  "http://localhost:5173",
  "https://byte-cart.vercel.app"
]

const corsOption = {
  origin : (origin,callback)=>{
    if (!origin || !whiteList.includes(origin)){
      callback(null,true)
    }
    else{
      callback(new Error("Not allowed by cors"))
    }
  },
  credentials:true
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption))
app.use("/api/auth/v1", authLimiter, authRoutes);
app.use("/api/admin", authLimiter, adminRoute);
app.use("/api/coupon", globalLimiter, couponRoutes);
app.use("/api/category", globalLimiter, categoryRoutes);
app.use("/api/products", globalLimiter, productRoutes);
app.use("/api/cart", globalLimiter, cartRoutes);
app.use("/api/users", globalLimiter, userRoutes);
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Port running on http://localhost/${PORT}`);
});
