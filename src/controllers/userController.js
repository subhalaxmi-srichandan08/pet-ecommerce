const userService = require("../services/userService");

class UserController {

    async getProfile(req, res, next) {

        try {

            const user =
                await userService.getProfile(
                    req.user.id
                );

            return res.status(200).json({

                success: true,

                data: user

            });

        } catch (error) {

            next(error);

        }

    }

    async updateProfile(req, res, next) {

    try {

        const user =
            await userService.updateProfile(
                req.user.id,
                req.body
            );

        return res.status(200).json({

            success: true,

            message: "Profile updated successfully.",

            data: user

        });

    } catch (error) {

        next(error);

    }

}
}

module.exports = new UserController();