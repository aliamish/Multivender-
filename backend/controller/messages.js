const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const express = require("express");
const router = express.Router();
const { upload } = require("../multer");

// create new message
router.post(
  "/create-new-message",
  upload.single("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { conversationId, sender, text } = req.body;

      let imageUrl;

      if (req.file) {
        const filename = req.file.filename;
        imageUrl = filename; // or path.join(filename) if you want a path
      }

      const message = new Messages({
        conversationId,
        sender,
        text,
        images: imageUrl || undefined, // ✅ only save if available
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const messages = await Messages.find({
        conversationId: req.params.id,
      });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
