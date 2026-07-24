const cartService = require("../services/cartService");

class CartController {

    async getCart(req, res, next) {

        try {

            const cart = await cartService.getCart(
                req.user.id
            );

            res.status(200).json({
                success: true,
                data: cart
            });

        } catch (err) {

            next(err);

        }

    }

    async addToCart(req, res, next) {

        try {

            const { productId, quantity = 1 } = req.body;

            const cart = await cartService.addToCart(
                req.user.id,
                productId,
                quantity
            );

            res.status(200).json({
                success: true,
                message: "Product added to cart",
                data: cart
            });

        } catch (err) {

            next(err);

        }

    }

    async updateQuantity(req, res, next) {

        try {

            const cart =
                await cartService.updateQuantity(
                    req.user.id,
                    req.params.productId,
                    req.body.quantity
                );

            res.status(200).json({
                success: true,
                data: cart
            });

        } catch (err) {

            next(err);

        }

    }

    async removeItem(req, res, next) {

        try {

            const cart =
                await cartService.removeItem(
                    req.user.id,
                    req.params.productId
                );

            res.status(200).json({
                success: true,
                data: cart
            });

        } catch (err) {

            next(err);

        }

    }

}

module.exports = new CartController();