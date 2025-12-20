// get all users
import { Admin } from "../models/admin.model.js";
import { User } from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).select("-password");
    if (allUsers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "users not found" });
    }
    return res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server Error",
    });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server Error",
    });
  }
};
// get personal user
export const getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const me = await User.findById(userId).select("-password");
    if (!me) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user: me });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userId = await User.findById(id);
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User not found or has been deleted",
      });
    }
    await User.findByIdAndDelete(id);
    return res.json({ success: true, message: "User Deleted" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
// update user details
export const updateMyProfile = async (req, res) => {
  const { name, username, email, password, displayPicture } = req.body;
  const userId = req.userId;
  try {
    // Find user by ID and exclude sensitive tokens
    const user = await User.findById(userId).select(
      "-verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordTokenExpiresAt"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin email cannot register as user",
      });
    }
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
    const emailInUse = await User.findOne({ email, _id: { $ne: userId } });
    if (emailInUse) {
      return res.status(409).json({
        success: false,
        message: "Email In Use",
      });
    }
    // Update fields manually
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (password !== undefined) {
      user.password = await bcryptjs.hash(password, 10);
    }

    // Handle display picture upload or direct URL
    if (req.file) {
      const userImageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "byte-cart-users",
      });
      user.displayPicture = userImageUpload.secure_url;
    } else if (displayPicture) {
      user.displayPicture = displayPicture;
    }

    // Save changes
    await user.save();
    return res.status(200).json({ success: true, details: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
