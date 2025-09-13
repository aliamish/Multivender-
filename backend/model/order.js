const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart: [
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
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
        },
        shopId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shop",
          required: true,
        },
      },
    ],

    shippingAddress: {
      type: Object,
      required: true,
    },

    // 🟢 Store shopId at the root level for easy queries
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    user: {
      type: Object, // you can later replace with `ref: "User"` if you want
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Processing",
        "Transferred to delivery partner",
        "Shipping",
        "Received",
        "On the way",
        "Delivered",
      ],
      default: "Processing",
    },

    paymentInfo: {
      id: { type: String },
      status: { type: String },
      type: { type: String },
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: Date,
  },
  { timestamps: true } // 🟢 auto-adds createdAt & updatedAt
);

module.exports = mongoose.model("Order", orderSchema);
