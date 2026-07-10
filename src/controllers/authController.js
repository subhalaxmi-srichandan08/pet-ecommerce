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
                    password
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

}

module.exports =
new AuthController();