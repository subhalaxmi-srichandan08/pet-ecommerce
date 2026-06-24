const express =
  require("express");

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

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs:
      15 * 60 * 1000,
    max: 100
  })
);

app.use(
  "/api/auth",
  authRoutes
);

app.get(
  "/",
  (req, res) => {
    res.send(
      "Pet Store API Running"
    );
  }
);

module.exports = app;