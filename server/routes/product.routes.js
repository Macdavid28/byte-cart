import express from "express";
import { upload } from "../config/multer.js";
import {
  createNewProduct,
  getAllProducts,
} from "../controllers/products.controller.js";
import { authMiddleware } from "./../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

export const productRoutes = express.Router();

productRoutes.post(
  "/create",
  authMiddleware,
  isAdmin,
  upload.single("coverImage"),
  createNewProduct
);
productRoutes.get("/all-products", getAllProducts);
