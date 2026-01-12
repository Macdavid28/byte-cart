import express from "express";
import {
  logout,
  updateAdminProfile,
} from "../controllers/admin.controller.js";
import { upload } from "../config/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const adminRoute = express.Router();

adminRoute.put(
  "/update/profile",
  upload.single("displayPicture"),
  authMiddleware,
  updateAdminProfile
);
adminRoute.post("/logout", logout);
