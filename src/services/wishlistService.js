const Wishlist = require("../models/Wishlist");

class WishlistService {

    async getWishlist(userId) {

        return await Wishlist
            .find({
                user: userId
            })
            .populate({
                path: "product",
                populate: [
                    {
                        path: "brand",
                        select: "name slug logo"
                    },
                    {
                        path: "category",
                        select: "name slug"
                    }
                ]
            })
            .sort({
                createdAt: -1
            })
            .lean();

    }

    async addToWishlist(userId, productId) {

        const exists =
            await Wishlist.findOne({
                user: userId,
                product: productId
            });

        if (exists) {
            return exists;
        }

        return await Wishlist.create({

            user: userId,

            product: productId

        });

    }

    async removeFromWishlist(userId, productId) {

        return await Wishlist.findOneAndDelete({

            user: userId,

            product: productId

        });

    }

    async isInWishlist(userId, productId) {

        const wishlist =
            await Wishlist.findOne({

                user: userId,

                product: productId

            });

        return !!wishlist;

    }

    async getWishlistCount(userId) {

        return await Wishlist.countDocuments({

            user: userId

        });

    }

}

module.exports = new WishlistService();