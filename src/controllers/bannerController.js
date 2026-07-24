const bannerService = require("../services/bannerService");

class BannerController {

    async getBanners(req, res, next) {

        try {

            const banners =
                await bannerService.getAllBanners();

            return res.status(200).json({
                success: true,
                count: banners.length,
                data: banners
            });

        } catch (error) {

            next(error);

        }

    }

}

module.exports = new BannerController();