import cloudinary from "../config/cloudinary.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import sharp from "sharp";

/**
 * Optimize an image buffer using sharp:
 * - Resize to max 800px width (preserving aspect ratio)
 * - Convert to WebP at 80% quality
 * Returns the optimized buffer.
 */
const optimizeImage = async (filePath) => {
  const buffer = await sharp(filePath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  return buffer;
};

/**
 * Upload an optimized image buffer to Cloudinary.
 * Returns the secure_url of the uploaded image.
 */
const uploadOptimizedImage = (buffer, folder = "bytecart") => {
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

export const createNewProduct = async (req, res) => {
  let { name, description, price, category, stock, color, coverImage } =
    req.body;
  try {
    if (
      !name ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !color ||
      (!req.files?.coverImage && !coverImage)
    ) {
      return res.status(403).json({
        success: false,
        message: "Fill In All Required Fields",
      });
    }
    const categoryId = await Category.findById(category);
    if (!categoryId) {
      return res
        .status(404)
        .json({ success: false, message: "invalid category" });
    }

    // Optimize and upload cover image
    if (req.files?.coverImage) {
      const optimizedBuffer = await optimizeImage(req.files.coverImage[0].path);
      coverImage = await uploadOptimizedImage(optimizedBuffer);
    }

    // Optimize and upload additional images
    let images = [];
    if (req.files?.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        const optimizedBuffer = await optimizeImage(file.path);
        const url = await uploadOptimizedImage(optimizedBuffer);
        images.push(url);
      }
    }

    const newProduct = await Product.create({
      ...req.body,
      admin: req.adminId,
      coverImage,
      images,
      category: categoryId._id,
    });
    const product = await Product.findById(newProduct._id)
      .select("-admin")
      .populate("category", "name -_id");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: product,
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
      .json({ success: true, products: allProducts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .select("-admin")
      .populate("category", "name");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  let { name, description, price, category, stock, color, coverImage } =
    req.body;
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    const categoryId = await Category.findById(category);
    if (!categoryId) {
      return res
        .status(404)
        .json({ success: false, message: "invalid category" });
    }
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (color !== undefined) product.color = color;

    // Optimize and upload new cover image
    if (req.files?.coverImage) {
      const optimizedBuffer = await optimizeImage(req.files.coverImage[0].path);
      product.coverImage = await uploadOptimizedImage(optimizedBuffer);
    } else if (coverImage !== undefined) {
      product.coverImage = coverImage;
    }

    // Optimize and upload new additional images
    if (req.files?.images && req.files.images.length > 0) {
      let images = [];
      for (const file of req.files.images) {
        const optimizedBuffer = await optimizeImage(file.path);
        const url = await uploadOptimizedImage(optimizedBuffer);
        images.push(url);
      }
      product.images = images;
    }

    await product.save();
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Delete images from Cloudinary
    const allImages = [product.coverImage, ...product.images].filter(Boolean);
    for (const imageUrl of allImages) {
      try {
        // Extract public_id from Cloudinary URL
        const parts = imageUrl.split("/");
        const folderAndFile = parts.slice(-2).join("/");
        const publicId = folderAndFile.replace(/\.[^.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      } catch {
        // Continue even if Cloudinary delete fails
      }
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
