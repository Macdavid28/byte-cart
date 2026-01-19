import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    image: String,
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      shippingFee: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },

    coupon: {
      code: String,
      type: {
        type: String,
        enum: ["percentage", "fixed", "free_shipping"],
      },
      value: Number,
      discountApplied: Number,
    },

    shipping: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: String,
      state: String,
      country: {
        type: String,
        default: "Nigeria",
      },
      zone: String,
      deliveryMethod: {
        type: String,
        default: "standard",
      },
    },

    payment: {
      method: {
        type: String,
        enum: ["card", "transfer", "wallet"],
      },
      provider: String,
      reference: String,
      status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
      },
      paidAt: Date,
    },

    tracking: {
      courier: String,
      trackingNumber: String,
      shippedAt: Date,
      deliveredAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

export default mongoose.model("Order", orderSchema);
