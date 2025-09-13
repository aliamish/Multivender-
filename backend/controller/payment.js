const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Payment Process
router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr", // INR, USD, etc.
      metadata: {
        company: "Becodemy",
      },
    });

    res.status(201).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);

// Get Stripe API Key (Frontend ko bhejne k liye)
router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
