const categoryService = require("../services/categoryService");

class CategoryController {

    async getCategories(req, res, next) {

        try {

            const categories =
                await categoryService.getAllCategories();

            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });

        } catch (error) {

            next(error);

        }

    }

    async getCategoriesByPet(req, res, next) {

        try {

            const categories =
                await categoryService.getCategoriesByPet(
                    req.params.pet
                );

            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });

        } catch (error) {

            next(error);

        }

    }

    async getFeaturedCategories(req, res, next) {

        try {

            const categories =
                await categoryService.getFeaturedCategories();

            res.status(200).json({
                success: true,
                count: categories.length,
                data: categories
            });

        } catch (error) {

            next(error);

        }

    }

}

module.exports = new CategoryController();