const express = require("express");

const router = express.Router();

const wishlistController =
    require("../controllers/wishlistController");

const auth =
    require("../middleware/auth");

// Get Wishlist
router.get(
    "/",
    auth,
    wishlistController.getWishlist
);

// Wishlist Count
router.get(
    "/count",
    auth,
    wishlistController.getWishlistCount
);

// Check Product
router.get(
    "/check/:productId",
    auth,
    wishlistController.isInWishlist
);

// Add Product
router.post(
    "/:productId",
    auth,
    wishlistController.addToWishlist
);

// Remove Product
router.delete(
    "/:productId",
    auth,
    wishlistController.removeFromWishlist
);

module.exports = router;