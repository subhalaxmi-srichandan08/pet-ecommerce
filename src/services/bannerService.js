const Banner = require("../models/Banner");

class BannerService {

    async getAllBanners() {

        return await Banner
            .find({
                isActive: true
            })
            .sort({
                displayOrder: 1
            })
            .lean();

    }

}

module.exports = new BannerService();