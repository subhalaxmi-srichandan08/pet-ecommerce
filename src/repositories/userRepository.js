const User = require("../models/User");

class UserRepository {

    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email, includePassword = false) {

        const query = User.findOne({
            email: email.toLowerCase().trim()
        });

        if (includePassword) {
            query.select("+password");
        }

        return await query;
    }

    async findById(id) {

        return await User.findById(id);

    }

    async updateById(id, update) {

        return await User.findByIdAndUpdate(
            id,
            update,
            {
                new: true,
                runValidators: true
            }
        );

    }

    async updateLastLogin(id) {

        return await User.findByIdAndUpdate(
            id,
            {
                lastLogin: new Date()
            },
            {
                new: true
            }
        );

    }

    async savePasswordResetToken(
        email,
        token,
        expires
    ) {

        return await User.findOneAndUpdate(
            {
                email
            },
            {
                passwordResetToken: token,
                passwordResetExpires: expires
            },
            {
                new: true
            }
        );

    }

    async clearPasswordReset(userId) {

        return await User.findByIdAndUpdate(
            userId,
            {
                passwordResetToken: null,
                passwordResetExpires: null
            },
            {
                new: true
            }
        );

    }

    async updatePassword(
        userId,
        password
    ) {

        const user =
            await User.findById(userId).select("+password");

        user.password = password;

        await user.save();

        return user;

    }

    async findByPasswordResetToken(token) {

    return await User.findOne({

        passwordResetToken: token,

        passwordResetExpires: {
            $gt: new Date()
        }

    }).select("+password");

}

}

module.exports = new UserRepository();