const app = require("./app");
const connectDB = require("./db/dataBase");
const cloudinary = require("cloudinary");
require("dotenv").config({ path: "backend/config/.env" });

// 🔹 Connect DB
connectDB();

// 🔹 Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Root Route (deployment check)
app.get("/", (req, res) => {
  res.status(200).send("✅ Deployment Successful!");
});

// 🔹 Export app for Vercel
module.exports = app;

// 🔹 Local Dev Only
if (process.env.NODE_ENV !== "PRODUCTION") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}
