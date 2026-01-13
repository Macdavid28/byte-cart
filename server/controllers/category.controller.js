import { Category } from "../models/category.model.js";
export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "fill in all required fields" });
  }
  const admin = req.adminId;
  const nameCheck = name.trim().toLowerCase();
  const existingCategory = await Category.findOne({
    name: nameCheck,
  });
  if (existingCategory) {
    return res.status(409).json({ success: false, message: "Category Exists" });
  }
  const newCategory = await Category.create({
    name: nameCheck,
    admin: admin,
  });
  const category = await Category.findById(newCategory._id).select("-admin");
  res.status(201).json({
    success: true,
    category: category,
  });
};

export const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({}).select("-admin");
    if (!allCategories) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, categories: allCategories });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
    const category = await Category.findById(id).select("-admin");
    if (!category) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, category: category });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const updateCategory = async (req, res) => {
  const adminId = req.adminId;  
  const { id } = req.params;
    try {
    const category = await Category.findByIdAndUpdate(id, { admin: adminId }).select("-admin");
    if (!category) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, category: category });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const deleteCategory = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
    try {
    const category = await Category.findByIdAndDelete(id, { admin: adminId }).select("-admin");
    if (!category) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, category: category });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
