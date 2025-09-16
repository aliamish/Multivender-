const express = require("express");
const app = require("./app");
const connectDB = require("./db/dataBase");
const cloudinary = require("cloudinary");
require("dotenv").config({ path: "backend/config/.env" });

// Connect Database
connectDB();

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Root route for Vercel check
app.get("/", (req, res) => {
  res.status(200).send("✅ Deployment Successful!");
});

// ❌ Don't use app.listen on Vercel
// ✅ Just export the app
module.exports = app;
