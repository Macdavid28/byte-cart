import cloudinary from "../config/cloudinary.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

export const createNewProduct = async (req, res) => {
  const { name, description, price, category, stock, color, coverImage } =
    req.body;
  try {
    if (
      !name ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !color ||
      (!req.file && !coverImage)
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
    // let finalImageUrl = coverImage;
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "bytecart",
      });
      coverImage = imageUpload.secure_url;
    }
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imagesUpload = await cloudinary.uploader.upload(file.path, {
          folder: "bytecart",
        });
        images.push(imagesUpload.secure_url);
      }
    }
    const newProduct = await Product.create({
      ...req.body,
      admin: req.adminId,
      coverImage,
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
    const productId = await Product.findById(id).select("-admin");
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      product: productId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal SErver Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { name, description, price, category, stock, color, coverImage } =
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
    const adminId = req.adminId;
    const categoryId = await Category.findById(category);
    if (!categoryId) {
      return res
        .status(404)
        .json({ success: false, message: "invalid category" });
    }
    if (name !== undefined) {
      product.name = name;
    }
    if (description !== undefined) {
      product.description = description;
    }
    if (price !== undefined) {
      product.price = price;
    }
    if (stock !== undefined) {
      product.stock = stock;
    }
    if (color !== undefined) {
      product.color = color;
    }
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "bytecart",
      });
      coverImage = imageUpload.secure_url;
    } else if (coverImage !== undefined) {
      product.coverImage = coverImage;
    }
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imagesUpload = await cloudinary.uploader.upload(file.path, {
          folder: "bytecart",
        });
        images.push(imagesUpload.secure_url);
      }
    }
    await Product.findByIdAndUpdate(product, adminId).select("-admin");
    return res.status(200).json({ success: true, product: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
