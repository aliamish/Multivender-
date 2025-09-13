const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");

const Product = require("../model/product");


// ---------------- CREATE NEW ORDER ----------------
router.post(
  "/create-order",
  catchAsyncError(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId.toString().trim(); // ✅ clean shopId always
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push({ ...item, shopId });
      }

      // create an order per shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
          shopId, // also store shopId at root if your schema has it
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// ---------------- GET ALL ORDERS OF A USER ----------------
router.get(
  "/get-all-orders/:userId",
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ---------------- GET ALL ORDERS OF A SELLER ----------------
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = req.params.shopId.trim();

      // Debug: show what we are querying
      console.log("👉 Looking for shopId:", shopId);

      const orders = await Order.find();

      console.log("👉 Orders found:", orders.length);

      res.status(200).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ---------------- UPDATE ORDER STATUS ----------------
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      // Agar status "Transferred to delivery partner" hai -> stock update karo
      if (req.body.status === "Transferred to delivery partner") {
        for (const o of order.cart) {
          await updateProductStock(o._id, o.qty);
        }
      }

      // Status update
      order.status = req.body.status;

      // Agar deliver ho gaya
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        if (order.paymentInfo) {
          order.paymentInfo.status = "Succeeded";
          const serviceCharge = order.totalPrice * .10;
         await updateSellerInfo(order.totalPrice - serviceCharge);
        }
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({ success: true, order });

      // Helper function
      async function updateProductStock(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
        }
      }

      async function updateSellerInfo (amount) {
        const seller = await Shop.findById(req.seller.id)


        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/order-refund/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      // Status update
      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });

      // Helper function
      async function updateProductStock(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all order ----- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({ deliverdAt: -1, createAt: -1 });

      res.status(201).json({
        success: true,
        orders,
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
