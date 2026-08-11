const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");

class UserService {

    async getProfile(userId) {

        const user =
            await userRepository.findById(userId);

        if (!user) {
            throw new ApiError(
                404,
                "User not found."
            );
        }

        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            isVerified: user.isVerified
        };
    }

    async updateProfile(userId, data) {

    const {
        firstName,
        lastName,
        phone
    } = data;

    const update = {};

    if (firstName !== undefined) {
        update.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
        update.lastName = lastName.trim();
    }

    if (phone !== undefined) {
        update.phone = phone.trim();
    }

    if (
        update.firstName === "" ||
        update.lastName === ""
    ) {
        throw new ApiError(
            400,
            "First name and last name are required."
        );
    }

    const user =
        await userRepository.updateById(
            userId,
            update
        );

    if (!user) {
        throw new ApiError(
            404,
            "User not found."
        );
    }

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified
    };
}
}

module.exports = new UserService();