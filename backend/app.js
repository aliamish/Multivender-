const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// ✅ CORS Middleware
const allowedOrigins = [
  "https://multivender-8np2.vercel.app", // frontend
  "https://multivender-iota.vercel.app"  // backend domain (for testing/debugging)
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Handle Preflight
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());
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
