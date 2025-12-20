import { User } from "../models/user.model.js";
import { Admin } from "./../models/admin.model.js";
import { generateJwt } from "./../utils/cookies.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "./../email/email.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import cloudinary from "./../config/cloudinary.js";
// signup function
export const signup = async (req, res) => {
  // input fields
  const { username, name, email, password } = req.body;
  try {
    // input validation
    if (!username || !name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all required fields" });
    }
    // check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ success: false, message: "User Exists" });
    }
    // check if user is an admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin account cannot register as user",
      });
    }
    // check if username is not taken by another email
    const takenUsername = await User.findOne({ username });
    if (takenUsername) {
      return res
        .status(409)
        .json({ success: false, message: "This username is already taken" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number.",
      });
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one special character.",
      });
    }

    // Check for uppercase and lowercase
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must include uppercase and lowercase letters.",
      });
    }
    // hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    // verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000);
    // verification token validity period for 10 minutes
    const verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    // create user
    const newUser = new User({
      username,
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt,
    });
    try {
      // save in database
      await newUser.save();
      // generate jwt and set cookies
      generateJwt(res, newUser._id);

      // send verification email
      await sendVerificationEmail(
        newUser.name,
        newUser.email,
        newUser.verificationToken
      );

      return res.status(201).json({
        success: true,
        message: "User Created and Verification Mail Sent",
        user: { ...newUser._doc, password: null },
      });
    } catch (error) {
      // if there's an error during creation and user created rollback
      // We attempt to delete the user if they were saved partially or if save succeeded but email failed
      await User.findByIdAndDelete(newUser._id);
      return res.status(400).json({
        success: false,
        message: "User Creation Failed",
        error: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Or Expired Token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: null },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Login Function
export const login = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // input validation
    if ((!username && !email) || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all required fields" });
    }
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    // Compare if password matches
    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    const verificationStatus = user.isVerified;
    if (!verificationStatus) {
      res.status(403).json({ success: false, message: "User not verified" });
    }
    user.isLoggedIn = true;
    await user.save();
    const token = generateJwt(res, user._id);
    return res.status(200).json({
      success: true,
      message: "User Login Successful",
      user: { ...user._doc, token, password: undefined },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const resendVerificationToken = async (req, res) => {
  const { email } = req.body;
  try {
    // validation
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "email address required" });
    }
    // check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }
    // Generate token and validity period
    const newVerificationToken = Math.floor(100000 + Math.random() * 900000);
    const newVerificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    // set database token to new token
    user.verificationToken = newVerificationToken;
    user.verificationTokenExpiresAt = newVerificationTokenExpiresAt;
    user.isLoggedIn = false;
    // save
    await user.save();
    // send mail
    await sendVerificationEmail(user.name, user.email, user.verificationToken);
    return res
      .status(200)
      .json({ success: true, message: "Verification Token sent successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email address required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }
    const resetToken = await crypto.randomBytes(32).toString("hex");
    const resetTokenValidity = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenValidity;
    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_LINK}/reset-password/${resetToken}`
    );
    return res.status(200).json({ success: true, message: "Reset Token Sent" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// reset password
export const resetPassword = async (req, res) => {
  const { code } = req.params;
  const { password } = req.body;
  try {
    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "provide reset token" });
    }
    const user = await User.findOne({
      resetPasswordToken: code,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    const previousPassword = await bcryptjs.compare(password, user.password);
    if (previousPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your current password",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number.",
      });
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one special character.",
      });
    }

    // Check for uppercase and lowercase
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must include uppercase and lowercase letters.",
      });
    }
    const hashedNewPassword = await bcryptjs.hash(password, 10);
    user.password = hashedNewPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresAt = null;
    await user.save();
    await sendResetSuccessEmail(user.email);
    return res.status(200).json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
// logout
export const logout = async (req, res) => {
  try {
    // clear the jwt token session
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User Logged Out" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: "User Not Found" });
  }
};
