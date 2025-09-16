const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://multivender-8np2.vercel.app"
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

// ✅ Preflight (OPTIONS) requests
app.options("*", cors());

// ✅ File upload
app.use(fileUpload());

// ✅ Serve static uploads folder
app.use("/", express.static(path.join(__dirname, "./uploads")));

// CONFIG
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// IMPORT ROUTES
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/messages");
const withdraw = require("./controller/withdraw");

// ROUTES
app.use("/api/v2/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/order", order);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/withdraw", withdraw);

// ✅ Health check / root route
app.get("/", (req, res) => {
  res.send("🚀 Deployment successful! Backend is running.");
});

// ERROR HANDLER
app.use(ErrorHandler);

module.exports = app;
