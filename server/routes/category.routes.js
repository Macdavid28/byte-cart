import express from "express";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
export const categoryRoutes = express.Router();

categoryRoutes.post("/create", authMiddleware, isAdmin, upload.single("coverImage"), createCategory);
categoryRoutes.get("/all", getAllCategories);
categoryRoutes.get("/:id", getCategoryById);
categoryRoutes.put("/:id", authMiddleware, isAdmin, upload.single("coverImage"), updateCategory);
categoryRoutes.delete("/:id", authMiddleware, isAdmin, deleteCategory);

