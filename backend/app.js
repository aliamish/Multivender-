const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://multivender-8np2.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ✅ add all methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ required headers
  })
);

// Multer/fileUpload ko middleware routes ke andar handle karna (global nahi)
app.use(bodyParser.urlencoded({ extended: true }));

// CONFIG
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

// ROUTES
app.use("/api/v2/user", require("./controller/user"));
app.use("/api/v2/shop", require("./controller/shop"));
app.use("/api/v2/product", require("./controller/product"));
app.use("/api/v2/event", require("./controller/event"));
app.use("/api/v2/coupon", require("./controller/coupounCode"));
app.use("/api/v2/payment", require("./controller/payment"));
app.use("/api/v2/order", require("./controller/order"));
app.use("/api/v2/conversation", require("./controller/conversation"));
app.use("/api/v2/message", require("./controller/messages"));
app.use("/api/v2/withdraw", require("./controller/withdraw"));

// ERROR HANDLER
app.use(ErrorHandler);

module.exports = app;
