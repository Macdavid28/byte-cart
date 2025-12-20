import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    // },
    coverImage: {
      type: String,
      required: true,
    },
    // images: {
    //   type: [String],
    //   default: [],
    // },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    color: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Products", productSchema);
