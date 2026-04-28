import { Category } from "../models/category.model.js";
import cloudinary from "../config/cloudinary.js";
import sharp from "sharp";

const optimizeImage = async (filePath) => {
  const buffer = await sharp(filePath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  return buffer;
};

const uploadOptimizedImage = (buffer, folder = "bytecart_categories") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, format: "webp" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

export const createCategory = async (req, res) => {
  try {
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
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Cover image is required" });
    }

    const optimizedBuffer = await optimizeImage(req.file.path);
    const coverImage = await uploadOptimizedImage(optimizedBuffer);

    const newCategory = await Category.create({
      name: nameCheck,
      coverImage: coverImage,
      admin: admin,
    });
    const category = await Category.findById(newCategory._id).select("-admin");
    res.status(201).json({
      success: true,
      category: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
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
  const { name } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    category.admin = adminId;
    if (name) category.name = name;

    if (req.file) {
      const optimizedBuffer = await optimizeImage(req.file.path);
      category.coverImage = await uploadOptimizedImage(optimizedBuffer);
    }

    await category.save();
    
    // Fetch updated to exclude admin if needed, or just return
    const updatedCategory = await Category.findById(id).select("-admin");
    return res.status(200).json({ success: true, category: updatedCategory });
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
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (category.coverImage) {
      try {
        const parts = category.coverImage.split("/");
        const folderAndFile = parts.slice(-2).join("/");
        const publicId = folderAndFile.replace(/\.[^.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        // Continue even if Cloudinary delete fails
      }
    }

    await Category.findByIdAndDelete(id);
    return res.status(200).json({ success: true, category: category });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
