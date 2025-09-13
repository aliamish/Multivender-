const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const express = require("express");
const router = express.Router();
const { isSeller, isAuthenticated } = require("../middleware/auth");

router.post(
  "/create-new-conversation",
  isSeller, // middleware sets req.seller
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId } = req.body;

      // seller id should come from authenticated seller, not client
      const sellerId = req.seller._id;

      // check existing
      const isConversationExist = await Conversation.findOne({ groupTitle });

      if (isConversationExist) {
        return res.status(201).json({
          success: true,
          conversation: isConversationExist,
        });
      }

      const conversation = await Conversation.create({
        members: [userId, sellerId], // ✅ guaranteed correct sellerId
        groupTitle,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

const mongoose = require("mongoose");

router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellerId = new mongoose.Types.ObjectId(req.params.id);

      const conversation = await Conversation.find({
        members: sellerId,
      }).sort({ updatedAt: -1 });

      res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get user conversations
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversation = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1, createdAt: -1 });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// update the last message
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
        lastMessage,
        lastMessageId,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;
