const Cart = require("../models/Cart");
const Product = require("../models/Product");

class CartService {

    async getCart(userId) {

        let cart = await Cart.findOne({ user: userId })
            .populate({
                path: "items.product",
                populate: [
                    {
                        path: "brand",
                        select: "name"
                    },
                    {
                        path: "category",
                        select: "name"
                    }
                ]
            });

        if (!cart) {

            cart = await Cart.create({
                user: userId,
                items: []
            });

            cart = await Cart.findById(cart._id)
                .populate({
                    path: "items.product",
                    populate: [
                        {
                            path: "brand",
                            select: "name"
                        },
                        {
                            path: "category",
                            select: "name"
                        }
                    ]
                });

        }

        return cart;

    }

    async addToCart(userId, productId, quantity = 1) {

        const product = await Product.findById(productId);

        if (!product)
            throw new Error("Product not found");

        let cart = await Cart.findOne({
            user: userId
        });

        if (!cart) {

            cart = await Cart.create({
                user: userId,
                items: []
            });

        }

        const existing = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existing) {

            existing.quantity += Number(quantity);

        } else {

            cart.items.push({
                product: productId,
                quantity: Number(quantity)
            });

        }

        await cart.save();

        return this.getCart(userId);

    }

    async updateQuantity(userId, productId, quantity) {

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart)
            throw new Error("Cart not found");

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item)
            throw new Error("Product not in cart");

        item.quantity = Number(quantity);

        if (item.quantity <= 0) {

            cart.items = cart.items.filter(
                item => item.product.toString() !== productId
            );

        }

        await cart.save();

        return this.getCart(userId);

    }

    async removeItem(userId, productId) {

        const cart = await Cart.findOne({
            user: userId
        });

        if (!cart)
            throw new Error("Cart not found");

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        return this.getCart(userId);

    }

}

module.exports = new CartService();