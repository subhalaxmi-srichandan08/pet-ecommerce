const RefreshToken = require("../models/RefreshToken");

class RefreshTokenRepository {

    async create(data) {
        return await RefreshToken.create(data);
    }

    async findByUser(userId) {
        return await RefreshToken.find({ user: userId });
    }

    async findByToken(token) {
        return await RefreshToken.findOne({ token });
    }

    async deleteByToken(token) {
        return await RefreshToken.deleteOne({ token });
    }

    async deleteByUser(userId) {
        return await RefreshToken.deleteMany({ user: userId });
    }

    async deleteAllByUser(userId) {

        return await RefreshToken.deleteMany({
            user: userId
        });

    }

}

module.exports = new RefreshTokenRepository();