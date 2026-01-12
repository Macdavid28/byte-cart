import express from "express";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
export const categoryRoutes = express.Router();

categoryRoutes.post("/create", authMiddleware, isAdmin, createCategory);
categoryRoutes.get("/all", getAllCategories);
categoryRoutes.get("/:id", getCategoryById);
categoryRoutes.put("/:id", authMiddleware, isAdmin, updateCategory);
categoryRoutes.delete("/:id", authMiddleware, isAdmin, deleteCategory);

