const brandService = require("../services/brandService");

class BrandController {

    async getBrands(req, res, next) {

        try {

            const brands =
                await brandService.getAllBrands();

            return res.status(200).json({
                success: true,
                count: brands.length,
                data: brands
            });

        } catch (error) {

            next(error);

        }

    }

    async getFeaturedBrands(req, res, next) {

        try {

            const brands =
                await brandService.getFeaturedBrands();

            return res.status(200).json({
                success: true,
                count: brands.length,
                data: brands
            });

        } catch (error) {

            next(error);

        }

    }

}

module.exports = new BrandController();