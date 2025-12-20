import { Admin } from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
import { generateJwt } from "../utils/cookies.js";
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
    // ;await admin.save()
    const token = generateJwt(res, null, admin._id);
    return res.status(200).json({
      success: true,
      message: "Admin Login Successful",
      user: { ...admin._doc, token, password: null },
    });
  } catch (error) {
    console.error(error);
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
