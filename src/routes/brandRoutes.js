const express = require("express");

const router = express.Router();

const brandController =
require("../controllers/brandController");

router.get(
    "/",
    brandController.getBrands
);

router.get(
    "/featured",
    brandController.getFeaturedBrands
);

module.exports = router;