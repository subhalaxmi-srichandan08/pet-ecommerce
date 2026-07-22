const express = require("express");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const helmet =
  require("helmet");
const morgan =
  require("morgan");
const rateLimit =
  require(
    "express-rate-limit"
  );
const authRoutes =
  require(
    "./routes/authRoutes"
  );
  const productRoutes =
require("./routes/productRoutes");
const brandRoutes =
require("./routes/brandRoutes");
const categoryRoutes =
require("./routes/categoryRoutes");
const bannerRoutes =
require("./routes/bannerRoutes");
const app = express();
app.use(
  express.json({
    limit: "10mb"
  })
);
const allowedOrigins = [
  "http://localhost:5173",
  "https://pawpoint-pet-ecommerce.netlify.app"
];
app.use(cors({
  origin: (origin, callback) => {

    if (!origin || allowedOrigins.includes(origin))
      return callback(null, true);

    callback(new Error("Not allowed by CORS"));

  },
  credentials: true
}));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs:
      15 * 60 * 1000,
    max: 100
  })
);


app.get(
  "/",
  (req, res) => {
    res.send(
      "Pet Store API Running"
    );
  }
);

app.use(
  "/api/auth",
  authRoutes
);
app.use(
    "/api/products",
    productRoutes
);
app.use(
    "/api/brands",
    brandRoutes
);
app.use(
    "/api/categories",
    categoryRoutes
);
app.use(
    "/api/banners",
    bannerRoutes
);



app.use(errorHandler);

module.exports = app;