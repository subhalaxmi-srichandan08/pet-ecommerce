const Category = require("../models/Category");

class CategoryService {

    async getAllCategories() {

        return await Category
            .find({
                isActive: true
            })
            .sort({
                displayOrder: 1
            })
            .lean();

    }

    async getCategoriesByPet(pet) {

        return await Category
            .find({
                pet,
                isActive: true
            })
            .sort({
                displayOrder: 1
            })
            .lean();

    }

    async getFeaturedCategories() {

        return await Category
            .find({
                featured: true,
                isActive: true
            })
            .sort({
                displayOrder: 1
            })
            .lean();

    }

}

module.exports = new CategoryService();