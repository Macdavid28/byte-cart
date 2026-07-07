import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./config/connectDb.js";
import { authRoutes } from "./routes/auth.routes.js";
import { productRoutes } from "./routes/product.routes.js";
import { adminRoute } from "./routes/admin.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { couponRoutes } from "./routes/coupon.routes.js";
import { categoryRoutes } from "./routes/category.routes.js";
import { authLimit, generalLimit } from "./middleware/ratelimit.js";
import { cartRoutes } from "./routes/cart.routes.js";
import { orderRoutes } from "./routes/order.routes.js";
import { reviewRoutes } from "./routes/review.routes.js";
dotenv.config();
const app = express();
const authLimiter = authLimit;
const globalLimiter = generalLimit;

const whiteList = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://byte-cart-store.vercel.app",
];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));

app.get("/", (req, res) => {
  res.send("<h1>Backend up and running</h1>");
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin", authLimiter, adminRoute);
app.use("/api/coupon", globalLimiter, couponRoutes);
app.use("/api/category", globalLimiter, categoryRoutes);
app.use("/api/products", globalLimiter, productRoutes);
app.use("/api/cart", globalLimiter, cartRoutes);
app.use("/api/orders", globalLimiter, orderRoutes);
app.use("/api/reviews", globalLimiter, reviewRoutes);
app.use("/api/users", globalLimiter, userRoutes);
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Port running on http://localhost:${PORT}`);
});
