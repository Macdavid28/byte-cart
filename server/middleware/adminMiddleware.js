import { Admin } from "../models/admin.model.js";

// Allows any authenticated Admin or Super Admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.adminId) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access only" });
    }
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access only" });
    }
    // Attach the full role from DB (source of truth, not just JWT)
    req.role = admin.role;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Allows ONLY Super Admins
export const isSuperAdmin = async (req, res, next) => {
  try {
    if (!req.adminId) {
      return res
        .status(403)
        .json({ success: false, message: "Super Admin access only" });
    }
    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Super Admin privileges required",
      });
    }
    req.role = admin.role;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
