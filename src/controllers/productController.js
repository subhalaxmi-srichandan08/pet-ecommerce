const productService = require("../services/productService");
const { successResponse } = require("../utils/response");

class ProductController {

    async getProducts(req, res, next) {

        try {

            const result =
                await productService.getProductBySlug(
                    req.params.slug
                );

            if (!result) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            next(error);

        }

    }

    async getProduct(req, res, next) {

        try {

            const product =
                await productService.getProductBySlug(
                    req.params.slug
                );

            if (!product) {

                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });

            }

            res.status(200).json({
                success: true,
                data: product
            });

        } catch (error) {

            next(error);

        }

    }

    async getFeaturedProducts(req, res, next) {

        try {

            const products =
                await productService.getProductsByLabel(
                    "FEATURED"
                );

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });

        } catch (error) {

            next(error);

        }

    }

    async getBestSellerProducts(req, res, next) {

        try {

            const products =
                await productService.getProductsByLabel(
                    "BEST_SELLER"
                );

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });

        } catch (error) {

            next(error);

        }

    }

    async getNewArrivalProducts(req, res, next) {

        try {

            const products =
                await productService.getProductsByLabel(
                    "NEW_ARRIVAL"
                );

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });

        } catch (error) {

            next(error);

        }

    }

}

module.exports = new ProductController();