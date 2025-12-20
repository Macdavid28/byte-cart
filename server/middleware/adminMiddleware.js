import { Admin } from "../models/admin.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access only" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
