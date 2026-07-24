const express = require("express");

const router = express.Router();

const categoryController =
require("../controllers/categoryController");


router.get(
    "/",
    categoryController.getCategories
);

router.get(
    "/featured",
    categoryController.getFeaturedCategories
);

router.get(
    "/pet/:pet",
    categoryController.getCategoriesByPet
);

module.exports = router;