const Product = require("../models/Product");
const Brand = require("../models/Brand");
const Category = require("../models/Category");

class ProductService {

    async getAllProducts(query) {

        const {
            page = 1,
            limit = 12,
            pet,
            brand,
            category,
            search,
            minPrice,
            maxPrice,
            rating,
            availability,
            sort = "newest"
        } = query;

        const filter = {
            isActive: true,
            isDeleted: false
        };

        // Pet Filter
        if (pet) {
            filter.pet = pet;
        }

        // Search
        if (search?.trim()) {

            const keyword = search.trim();

            const [brands, categories] = await Promise.all([

                Brand.find({
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                }).select("_id"),

                Category.find({
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                }).select("_id")

            ]);

            filter.$or = [

                {
                    name: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    sku: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    shortDescription: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    description: {
                        $regex: keyword,
                        $options: "i"
                    }
                },

                {
                    tags: {
                        $elemMatch: {
                            $regex: keyword,
                            $options: "i"
                        }
                    }
                }

            ];

            if (brands.length) {

                filter.$or.push({

                    brand: {
                        $in: brands.map(
                            brand => brand._id
                        )
                    }

                });

            }

            if (categories.length) {

                filter.$or.push({

                    category: {
                        $in: categories.map(
                            category => category._id
                        )
                    }

                });

            }

        }

        // Brand Filter
        if (brand) {
            console.log("Brand Slug:", brand);
            const brandData = await Brand.findOne({
                slug: brand
            });
            console.log("Brand Data:", brandData);
            if (brandData) {
                filter.brand = brandData._id;
            }

        }

        // Category Filter
        if (category) {

            const categoryData = await Category.findOne({
                slug: category
            });

            if (categoryData) {
                filter.category = categoryData._id;
            }

        }

        // Price Filter
        if (minPrice || maxPrice) {

            filter.discountPrice = {};

            if (minPrice) {
                filter.discountPrice.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.discountPrice.$lte = Number(maxPrice);
            }

        }

        // Rating Filter
        if (rating) {

            filter.rating = {
                $gte: Number(rating)
            };

        }

        // Availability Filter
        if (availability === "inStock") {

            filter.stock = {
                $gt: 0
            };

        } else if (availability === "outOfStock") {

            filter.stock = 0;

        }

        // Sorting
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

            default:
                sortOption = {
                    createdAt: -1
                };

        }

        const skip =
            (Number(page) - 1) *
            Number(limit);
        console.log("FILTER =", JSON.stringify(filter, null, 2));
        const [products, total] =
            await Promise.all([

                Product.find(filter)
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
                    .lean(),

                Product.countDocuments(filter)

            ]);

        return {

            products,

            pagination: {

                page: Number(page),

                limit: Number(limit),

                total,

                totalPages: Math.ceil(
                    total / Number(limit)
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
                "name slug thumbnail price discountPrice rating reviewCount brand labels"
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

    async getSearchSuggestions(query) {

        const keyword = query?.trim();

        if (!keyword || keyword.length < 2) {
            return {
                products: [],
                brands: [],
                categories: []
            };
        }

        const regex = new RegExp(
            `^${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
            "i"
        );

        const [products, brands, categories] =
            await Promise.all([

                // Products
                Product.find({
                    isActive: true,
                    isDeleted: false,
                    $or: [
                        {
                            name: regex
                        },
                        {
                            sku: regex
                        },
                        {
                            tags: regex
                        }
                    ]
                })
                    .select(
                        "name slug thumbnail price discountPrice"
                    )
                    .limit(6)
                    .lean(),

                // Brands
                Brand.find({
                    isActive: true,
                    name: regex
                })
                    .select("name slug logo")
                    .limit(4)
                    .lean(),

                // Categories
                Category.find({
                    isActive: true,
                    name: regex
                })
                    .select("name slug pet image")
                    .limit(4)
                    .lean()

            ]);

        return {
            products,
            brands,
            categories
        };
    }

}

module.exports = new ProductService();