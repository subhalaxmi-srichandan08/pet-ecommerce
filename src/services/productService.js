const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

class ProductService {

    async getAllProducts(query) {

        const {
            page = 1,
            limit = 12,
            pet,
            category,
            brand,
            search,
            minPrice,
            maxPrice,
            sort = "newest"
        } = query;

        const filter = {
            isActive: true,
            isDeleted: false
        };

        if (pet)
            filter.pet = pet;

        if (category)
            filter.category = category;

        if (brand)
            filter.brand = brand;

        if (search) {

            filter.$text = {
                $search: search
            };

        }

        if (minPrice || maxPrice) {

            filter.discountPrice = {};

            if (minPrice)
                filter.discountPrice.$gte =
                    Number(minPrice);

            if (maxPrice)
                filter.discountPrice.$lte =
                    Number(maxPrice);

        }

        let sortOption = {
            createdAt: -1
        };

        switch (sort) {

            case "priceAsc":
                sortOption = {
                    discountPrice: 1
                };
                break;

            case "priceDesc":
                sortOption = {
                    discountPrice: -1
                };
                break;

            case "rating":
                sortOption = {
                    rating: -1
                };
                break;

            case "popular":
                sortOption = {
                    reviewCount: -1
                };
                break;

        }

        const skip =
            (page - 1) * limit;

        const products =
            await Product
                .find(filter)
                .populate(
                    "brand",
                    "name slug logo"
                )
                .populate(
                    "category",
                    "name slug pet"
                )
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit))
                .lean();

        const total =
            await Product.countDocuments(
                filter
            );

        return {

            products,

            pagination: {

                total,

                page: Number(page),

                limit: Number(limit),

                totalPages:
                    Math.ceil(
                        total / limit
                    )

            }

        };

    }

    async getProductBySlug(slug) {
        const product = await Product.findOne({
            slug,
            isActive: true,
            isDeleted: false
        })
            .populate("brand", "name slug logo")
            .populate("category", "name slug pet")
            .lean();

        if (!product)
            return null;

        const relatedProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: product._id },
            isActive: true,
            isDeleted: false
        })
            .limit(8)
            .select(
                "name slug thumbnail price discountPrice rating reviewCount"
            )
            .lean();

        return {
            product,
            relatedProducts
        };
    }

    async getProductsByLabel(label) {

        return await Product
            .find({
                labels: label,
                isActive: true,
                isDeleted: false
            })
            .populate("brand")
            .populate("category")
            .lean();

    }

}

module.exports = new ProductService();