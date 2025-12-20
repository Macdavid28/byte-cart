import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resendVerificationToken,
  resetPassword,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verify-token.js";
import { upload } from "../config/multer.js";

export const authRoutes = express.Router();

authRoutes.get("/check-auth", verifyToken, checkAuth);

// authRoutes.put(
//   "/update/:id",
//   updateUserDetails,
//   upload.single("displayPicture")
// );
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/signup", signup);
authRoutes.post("/verify-email", verifyEmail);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password/:code", resetPassword);
authRoutes.post("/resend-token", resendVerificationToken);
