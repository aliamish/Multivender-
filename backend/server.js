const app = require("./app");
const connectDB = require("./db/dataBase");
const express = require("express");
const path = require("path");
require("dotenv").config({ path: "backend/config/.env" });

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

// HANDLING UNCAUGHT EXCEPTIONS
process.on("uncaughtException", (err) => {
  console.log(`❌ Error: ${err.message}`);
  console.log("Shutting down the server due to an uncaught exception...");
  process.exit(1);
});

// CONNECT DB
connectDB();

// CREATE SERVER
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// UNHANDLED PROMISE REJECTION
process.on("unhandledRejection", (err) => {
  console.log(`❌ Shutting down the server due to: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
