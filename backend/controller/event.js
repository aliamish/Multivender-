const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const router = express.Router();
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const fs = require("fs");
const { json } = require("stream/consumers");

// Create event
router.post(
  "/create-event",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { shopId, images, Start_Date, Finish_Date, ...rest } = req.body;

      // Validate shop
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      if (!images || images.length === 0) {
        return next(
          new ErrorHandler("Please provide at least one image!", 400)
        );
      }

      if (!Start_Date || !Finish_Date) {
        return next(
          new ErrorHandler("Start_Date and Finish_Date are required!", 400)
        );
      }

      const eventData = {
        ...rest,
        images, // ✅ array of strings from frontend Cloudinary URLs
        shop,
        shopId,
        Start_Date, // match your schema
        Finish_Date, // match your schema
      };

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// GET ALL PRODUCTS FOR ALL PRODUCTS
router.get(
  "/get-all-events/:id",
  catchAsyncError(async (req, resp, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });
      resp.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// DELETE EVENT OF A SHOP
router.delete(
  "/delete-shop-event/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const eventData = await Event.findById(productId);

      eventData.images.forEach((imageUrl) => {
        const filename = imageUrl;
        const filePath = `uploads/${filename}`;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      });

      const event = await Event.findByIdAndDelete(productId);

      if (!event) {
        return next(new ErrorHandler("Event not found with this id!", 500));
      }

      res.status(201).json({
        success: true,
        message: "Event Delete successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// all events --- for admin

router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find().sort({ createAt: -1 });

      res.status(201).json({
        success: true,
        events,
      })
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
