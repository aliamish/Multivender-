const express = require("express");
const catchAsyncError = require("../middleware/catchAsyncError");
const Shop = require("../model/shop");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const CoupounCode = require("../model/coupounCode");

// create coupoin code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const isCoupounCodeExists = await CoupounCode.findOne({
        name: req.body.name,
      });

      if (isCoupounCodeExists) {
        return next(new ErrorHandler("Coupoun code already exists!", 400));
      }

      const coupounCode = await CoupounCode.create(req.body);

      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all coupons of a shop
router.get(    
  "/get-coupon/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CoupounCode.find({ shop:{
        _id:  req.params.id
      }  });

      res.status(201).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


// get coupon code value by its name
router.get("/get-coupon-value/:name", catchAsyncError(async(req,res,next) => {
  try {
    const coupounCode = await CoupounCode.findOne({ name: req.params.name});

    res.status(200).json({
      success: true,
      coupounCode,
    })
  } catch (error) {
          return next(new ErrorHandler(error, 400));

  }
}))

module.exports = router;
