const express = require("express");

const router = express.Router();

const productController =
    require("../controllers/productController");


router.get(
    "/",
    productController.getProducts
);

router.get(
    "/featured",
    productController.getFeaturedProducts
);

router.get(
    "/best-sellers",
    productController.getBestSellerProducts
);

router.get(
    "/new-arrivals",
    productController.getNewArrivalProducts
);

router.get(
    "/suggestions",
    productController.getSearchSuggestions
);

router.get(
    "/:slug",
    productController.getProduct
);

module.exports = router;