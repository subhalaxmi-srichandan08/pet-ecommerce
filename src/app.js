const express =
  require("express");

const errorHandler =
  require("./middleware/errorHandler");

const cors =
  require("cors");

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

const app = express();

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(cors({
  origin: "https://pawpoint-pet-ecommerce.netlify.app",
  credentials: true
}));

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


app.use(errorHandler);

module.exports = app;