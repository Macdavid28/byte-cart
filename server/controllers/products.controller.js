import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";

export const createNewProduct = async (req, res) => {
  const { name, description, price, category, stock, color, coverImage } =
    req.body;
  try {
    if (
      !name ||
      !description ||
      price === undefined ||
      // !category ||
      stock === undefined ||
      !color ||
      (!req.file && !coverImage)
    ) {
      return res.status(403).json({
        success: false,
        message: "Fill In All Required Fields",
      });
    }
    let finalImageUrl = coverImage;
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "bytecart",
      });
      finalImageUrl = imageUpload.secure_url;
    }
    const newProduct = await Product.create({
      ...req.body,
      admin: req.adminId,
      coverImage: finalImageUrl,
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}).select("-admin");
    if (!allProducts) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }
    return res
      .status(200)
      .json({ success: true, products: { ...allProducts } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
