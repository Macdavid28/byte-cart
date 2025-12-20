import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./server/config/connectDb.js";
import expressRateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
// import { verifyToken } from "./server/middleware/verify-token.js";
import { authRoutes } from "./server/routes/auth.routes.js";
import { productRoutes } from "./server/routes/product.routes.js";
import { adminRoute } from "./server/routes/admin.routes.js";
import { userRoutes } from "./server/routes/user.routes.js";
dotenv.config();
const app = express();
const authLimiter = expressRateLimit({
  max: 100, //Limit each IP to 100 requests per windowMs
  windowMs: 15 * 60 * 1000, //15 minutes
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const globalLimiter = expressRateLimit({
  max: 1000, //Limit each IP to 1000 requests per windowMs
  windowMs: 15 * 60 * 1000, //15 minutes
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(express.json());
app.use(cookieParser());

// Apply global rate limiting to all requests
app.use(globalLimiter);
app.use("/api/auth/v1", authLimiter, authRoutes);
app.use("/api/", authLimiter, adminRoute);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  connectDb();
  console.log(`Port running on http://localhost/${PORT}`);
});
