const authService =
    require("../services/authService");

class AuthController {

    async register(
        req,
        res,
        next
    ) {

        try {

            const result =
                await authService.register(
                    req.body
                );

            return res
                .status(201)
                .json({

                    success: true,

                    message:
                        "Registration successful.",

                    data: result

                });

        }

        catch (error) {
            console.error(error);
            next(error);
        }
    }

    async login(
        req,
        res,
        next
    ) {

        try {

            const {
                email,
                password
            } = req.body;

            const result =
                await authService.login(
                    email,
                    password,
                    req, res
                );

            return res.json({

                success: true,

                message:
                    "Login successful.",

                data: result

            });

        }

        catch (error) {

            next(error);

        }

    }

    async refresh(req, res, next) {

        try {

            const result = await authService.refresh(req, res);

            return res.json({
                success: true,
                message: "Token refreshed.",
                data: result
            });

        } catch (error) {
            next(error);
        }

    }

    async logout(req, res, next) {

        try {

            await authService.logout(req, res);

            return res.json({
                success: true,
                message: "Logged out successfully."
            });

        } catch (error) {
            next(error);
        }

    }

    async forgotPassword(req, res, next) {

        try {
            // console.log(req.body);
            await authService.forgotPassword(req.body.email);

            return res.json({

                success: true,

                message:
                    "If an account with that email exists, a password reset link has been sent."

            });

        }

        catch (error) {

            next(error);

        }

    }

    async resetPassword(req, res, next) {

        try {

            const { password } = req.body;

            await authService.resetPassword(
                req.params.token,
                password
            );

            return res.json({

                success: true,

                message: "Password reset successfully."

            });

        } catch (error) {

            next(error);

        }

    }

    async googleLogin(req, res, next) {

    try {

        const {
            credential
        } = req.body;

        const result =
            await authService.googleLogin(
                credential,
                req,
                res
            );

        return res.json({

            success: true,

            message:
                "Google authentication successful.",

            data: result

        });

    } catch (error) {

        next(error);

    }

}

}


module.exports =
    new AuthController();