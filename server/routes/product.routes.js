import express from "express";
import { upload } from "../config/multer.js";
import {
  createNewProduct,
  getAllProducts,
  getProductById,
  updateProduct,
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
productRoutes.get("/all", getAllProducts);
productRoutes.get("/product/:id", getProductById);
productRoutes.put(
  "/update/:id",
  authMiddleware,
  isAdmin,
  upload.single("coverImage"),updateProduct
);
