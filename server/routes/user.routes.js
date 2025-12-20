import express from "express";
import {
  deleteUser,
  getAllUsers,
  getMe,
  getUserById,
  updateMyDetails,
} from "./../controllers/user.controller.js";
import { verifyToken } from "../middleware/verify-token.js";
export const userRoutes = express.Router();

userRoutes.get("/all", getAllUsers);
userRoutes.get("/user/me", verifyToken, getMe);
userRoutes.put("/user/update/me", verifyToken, updateMyDetails);
userRoutes.get("/user/:id", getUserById);
userRoutes.delete("/user/:id", deleteUser);
