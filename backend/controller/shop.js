const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendShopToken = require("../utils/shopToken");

// CREATE SHOP
router.post("/create-shop", catchAsyncError(async (req, res, next) => {
  const { name, email, password, avatar, phoneNumber, address, zipCode } = req.body;

  if (!name || !email || !password || !avatar) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  let seller = await Shop.findOne({ email });
  if (seller) {
    return next(new ErrorHandler("Shop already exists", 400));
  }

  const newSeller = { name, email, password, avatar, phoneNumber, address, zipCode };
  const activationToken = createActivationToken(newSeller);
  const activationUrl = `https://multivender-8np2.vercel.app/seller/activation/${activationToken}`;

  await sendMail({
    email: newSeller.email,
    subject: "Activate your Shop",
    message: `Hello ${newSeller.name}, please click the link to activate your Shop: ${activationUrl}`,
  });

  res.status(201).json({
    success: true,
    message: `Please check your email (${newSeller.email}) to activate your Shop.`,
  });
}));

// CREATE ACTIVATION TOKEN
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, { expiresIn: "2h" });
};

// ACTIVATE SHOP
router.post("/activation", catchAsyncError(async (req, res, next) => {
  const { activation_token } = req.body;
  const decodedSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

  const { name, email, password, avatar, phoneNumber, address, zipCode } = decodedSeller;

  let seller = await Shop.findOne({ email });
  if (seller) {
    return next(new ErrorHandler("Shop already exists", 400));
  }

  seller = await Shop.create({ name, email, password, avatar, phoneNumber, address, zipCode });
  sendShopToken(seller, 201, res);
}));
// ACTIVATE SHOP
router.post("/activation", catchAsyncError(async (req, res, next) => {
  const { activation_token } = req.body;

  const decodedShop = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
  if (!decodedShop) return next(new ErrorHandler("Invalid Token", 400));

  const { name, email, password, avatar, zipCode, phoneNumber, address } = decodedShop;

  const shopExist = await Shop.findOne({ email });
  if (shopExist) return next(new ErrorHandler("Shop already exists", 400));

  const shop = await Shop.create({ name, email, password, avatar, zipCode, phoneNumber, address });
  sendShopToken(shop, 201, res);
}));
// LOGIIN OUR USER
router.post(
  "/login-shop",
  catchAsyncError(async (req, resp, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please provide all feilda", 400));
      }
      const shop = await Shop.findOne({ email }).select("+password");
      if (!shop) {
        return next(new ErrorHandler("Shop dosn't esists!", 400));
      }
      const isPasswordValid = await shop.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide correct information", 400)
        );
      }

      sendShopToken(shop, 201, resp);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// LOAD OUT SHOP

router.get(
  "/getSeller",
  isSeller,
  catchAsyncError(async (req, resp, next) => {
    try {
      const seller = await Shop.findById(req.seller.id);

      if (!seller) {
        return next(new ErrorHandler("Shop doen't exists", 400));
      }
      resp.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncError(async (req, resp, next) => {
    try {
      resp.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      resp.status(201).json({
        success: true,
        message: "Log out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile pitcher
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncError(async (req, res, next) => {
    try {
      const existsUser = await Shop.findById(req.seller._id);

      const existsAvatarPath = `uploads/${existsUser.avatar}`;

      fs.unlinkSync(existsAvatarPath);

      const fileUrl = path.join(req.file.filename);

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        avatar: fileUrl,
      });

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller Info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin

router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({ createAt: -1 });

      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ----admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods ---- sellers
router.put(
  "/update-payment-medthods",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods ---- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
