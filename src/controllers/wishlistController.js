const wishlistService =
    require("../services/wishlistService");

class WishlistController {

    async getWishlist(req, res, next) {

        try {

            const wishlist =
                await wishlistService.getWishlist(
                    req.user.id
                );

            res.status(200).json({

                success: true,

                count: wishlist.length,

                data: wishlist

            });

        } catch (error) {

            next(error);

        }

    }

    async addToWishlist(req, res, next) {

        try {

            await wishlistService.addToWishlist(

                req.user.id,

                req.params.productId

            );

            res.status(200).json({

                success: true,

                message: "Product added to wishlist."

            });

        } catch (error) {

            next(error);

        }

    }

    async removeFromWishlist(req, res, next) {

        try {

            await wishlistService.removeFromWishlist(

                req.user.id,

                req.params.productId

            );

            res.status(200).json({

                success: true,

                message: "Product removed from wishlist."

            });

        } catch (error) {

            next(error);

        }

    }

    async getWishlistCount(req, res, next) {

        try {

            const count =
                await wishlistService.getWishlistCount(
                    req.user.id
                );

            res.status(200).json({

                success: true,

                count

            });

        } catch (error) {

            next(error);

        }

    }

    async isInWishlist(req, res, next) {

        try {

            const exists =
                await wishlistService.isInWishlist(

                    req.user.id,

                    req.params.productId

                );

            res.status(200).json({

                success: true,

                exists

            });

        } catch (error) {

            next(error);

        }

    }

}

module.exports = new WishlistController();