import express from "express";
import {
  deleteProfile,
  deleteUser,
  getAllUsers,
  getProfile,
  getUserById,
  updateMyProfile,
} from "./../controllers/user.controller.js";
import { verifyToken } from "../middleware/verify-token.js";
export const userRoutes = express.Router();

userRoutes.get("/all", getAllUsers);
userRoutes.get("/user/profile", verifyToken, getProfile);
userRoutes.put("/user/update/profile", verifyToken, updateMyProfile);
userRoutes.delete("/delete/me", verifyToken, deleteProfile);
userRoutes.get("/user/:id", getUserById);
userRoutes.delete("/delete/:id", deleteUser);
