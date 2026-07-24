const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cartController");
const auth = require("../middleware/auth");

router.use(auth);

router.get(
    "/",
    cartController.getCart
);

router.post(
    "/",
    cartController.addToCart
);

router.patch(
    "/:productId",
    cartController.updateQuantity
);

router.delete(
    "/:productId",
    cartController.removeItem
);

module.exports = router;