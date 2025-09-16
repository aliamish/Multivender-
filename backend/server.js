const app = require("./app");
const connectDB = require("./db/dataBase");
const cloudinary = require("cloudinary");
require("dotenv").config({ path: "backend/config/.env" });

// 🔹 Connect to Database
connectDB();

// 🔹 Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Root route for deployment check
app.get("/", (req, res) => {
  res.status(200).send("✅ Deployment Successful!");
});

// 🔹 Export app (for Vercel)
module.exports = app;

// 🔹 Local development (only run when not in serverless)
if (process.env.NODE_ENV !== "PRODUCTION") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });

  // Error Handling
  process.on("uncaughtException", (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    process.exit(1);
  });
}
