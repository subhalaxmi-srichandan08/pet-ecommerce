const Brand = require("../models/Brand");

class BrandService {

    async getAllBrands() {

        return await Brand
            .find({
                isActive: true
            })
            .sort({
                displayOrder: 1
            })
            .lean();

    }

    async getFeaturedBrands() {

        return await Brand
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

module.exports = new BrandService();