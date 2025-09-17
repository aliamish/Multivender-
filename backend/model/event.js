const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your event product name!"],
  },
  description: {
    type: String,
    required: [true, "Please Enter your event product description!"],
  },
  category: {
    type: String,
    required: [true, "Please Enter your event product category!"],
  },
  start_Date: {
    type: Date,
    required: true,
  },
  Finish_Date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Running", "Completed", "Pending"], // optional, only allowed values
    default: "Running", // 👈 yeh hona chahiye
  },

  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please Enter your event product  price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter your event product Stock!"],
  },
  images: [
    {
      type: String,
    },
  ],
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    requied: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Event", eventSchema);
