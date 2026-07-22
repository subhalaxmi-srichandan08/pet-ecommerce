const path = require("path");
const fs = require("fs-extra");
require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");

const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Banner = require("../models/Banner");
const Product = require("../models/Product");

async function loadJSON(file) {
  const filePath = path.join(__dirname, "data", file);

  return fs.readJson(filePath);
}

async function seedDatabase() {
  try {

    await connectDB();

    console.log("\n===============================");
    console.log("Starting Database Seeding...");
    console.log("===============================\n");

    const brands = await loadJSON("brands.json");
    const categories = await loadJSON("categories.json");
    const banners = await loadJSON("banners.json");
    const products = await loadJSON("products.json");

    console.log("Clearing existing collections...");

    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});

    console.log("Collections cleared.\n");

    console.log("Seeding Brands...");

    const insertedBrands = await Brand.insertMany(brands);

    console.log(`Inserted ${insertedBrands.length} brands.`);

    console.log("Seeding Categories...");

    const insertedCategories = await Category.insertMany(categories);

    console.log(`Inserted ${insertedCategories.length} categories.`);

    console.log("Seeding Banners...");

    const insertedBanners = await Banner.insertMany(banners);

    console.log(`Inserted ${insertedBanners.length} banners.`);

    const brandMap = new Map();

    insertedBrands.forEach((brand) => {
      brandMap.set(brand.name, brand._id);
    });

    const categoryMap = new Map();

    insertedCategories.forEach((category) => {
      categoryMap.set(category.slug, category._id);
    });

    console.log("Preparing Products...");

    const formattedProducts = products.map((product) => ({
      ...product,

      brand: brandMap.get(product.brand),

      category: categoryMap.get(product.category),
        thumbnail:
    product.thumbnail ||
    "https://placehold.co/600x600/png",
    }));

    console.log("Seeding Products...");

    const insertedProducts = await Product.insertMany(
      formattedProducts
    );

    console.log(
      `Inserted ${insertedProducts.length} products.`
    );

    console.log("\n=================================");
    console.log("Database Seeded Successfully");
    console.log("=================================\n");

    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {

    console.error(error);

    await mongoose.disconnect();

    process.exit(1);

  }
}

seedDatabase();