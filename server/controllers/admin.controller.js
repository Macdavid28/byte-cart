import { Admin } from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
import { generateJwt } from "../utils/cookies.js";
import cloudinary from "../config/cloudinary.js";
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Fill in all required fields" });
    }
    const admin = await Admin.findOne({
      email,
    });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }
    // Check if password is valid
    const validPassword = await bcryptjs.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = generateJwt(res, null, admin._id);
    return res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      admin: { ...admin._doc, token, password: null },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  const { name, email, password, displayPicture } = req.body;
  try {
    const adminId = req.adminId;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    // 3. Optional Password Validation
    if (password) {
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
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must contain at least one special character.",
        });
      }
      if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password must include uppercase and lowercase letters.",
        });
      }
      admin.password = password; // Set plain text for the .save() hook to hash
    }
    const emailInUse = await Admin.findOne({ email, _id: { $ne: adminId } });
    if (emailInUse) {
      return res.status(409).json({
        success: false,
        message: "Email In Use",
      });
    }
    if (name !== undefined) admin.name = name;
    if (email !== undefined) admin.email = email;

    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "byte-cart-admin",
      });
      admin.displayPicture = imageUpload.secure_url;
    } else if (displayPicture !== undefined) {
      admin.displayPicture = displayPicture;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
      admin: { ...admin._doc, password: undefined }, // Hide password from response
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Admin Logged Out" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
