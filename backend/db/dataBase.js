const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "ecommerce", // ✅ yahan apni DB ka naam diya
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});


module.exports = connectDB;
