const express = require("express");
const Product = require("../model/product");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Order = require("../model/order")
const mongoose = require('mongoose');
const catchAsyncError = require("../middleware/catchAsyncError");


// CREATE A NEW  PRODUCT
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    const { name, description, category, tags, originalPrice, discountPrice, stock, images } = req.body;
        if (!req.seller) return next(new ErrorHandler("Seller not found", 401));

        const shopId = req.seller._id; // ✅ use seller's ID directly


    const shop = await Shop.findById(shopId);
    if (!shop) return next(new ErrorHandler("Shop Id is invalid!", 400));

    const product = await Product.create({
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      shopId,
      shop,
images: images.map((img) => (typeof img === "string" ? img : img.url)),
    });

    res.status(201).json({ success: true, product });
  })
);





// GET ALL PRODUCTS FOR ALL PRODUCTS
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, resp, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      resp.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

router.get("/get-all-products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Get products error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



// DELETE PRODUCT OF A SHOP
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const productData = await Product.findById(productId);

      productData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Product Delete successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

const product = await Product.findById(productId).populate("reviews.user");
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found with this ID" });
      }

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      // ✅ simple safe update for order cart
      const order = await Order.findById(orderId);
      if (!order) return next(new ErrorHandler("Order not found", 404));

      order.cart.forEach((item) => {
        if (item.productId.toString() === productId.toString()) {
          item.isReviewed = true;
        }
      });

      await order.save();

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);


// all products --- for admin

router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createAt: -1 });

      res.status(201).json({
        success: true,
        products,
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




module.exports = router;
