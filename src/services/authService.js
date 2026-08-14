const crypto = require("crypto");
const {
    verifyGoogleToken
} = require("../utils/googleAuth");
const userRepository = require("../repositories/userRepository");
const refreshTokenRepository = require("../repositories/refreshTokenRepository");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { hashToken } = require("../utils/tokenHelper");
const ApiError = require("../utils/ApiError");
const emailService = require("./emailService");
const resetPasswordTemplate = require("../templates/resetPasswordTemplate");

class AuthService {

    async register(userData) {

        const {
            firstName,
            lastName,
            email,
            password
        } = userData;

        const existingUser =
            await userRepository.findByEmail(email);

        if (existingUser) {
            throw new ApiError(
                409,
                "Email already registered."
            );
        }

        const user =
            await userRepository.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                password
            });

        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

    }

    async login(email, password, req, res) {

        const user = await userRepository.findByEmail(email, true);

        if (!user) throw new ApiError(401, "Invalid email or password.");

        const matched = await user.comparePassword(password);

        if (!matched) throw new ApiError(401, "Invalid email or password.");

        if (user.isBlocked) throw new ApiError(403, "Account blocked.");

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        const hashedToken = hashToken(refreshToken);

        await refreshTokenRepository.create({
            user: user._id,
            token: hashedToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ip: req.ip,
            device: req.headers["user-agent"] || ""
        });
        console.log(this.cookieOptions);
        res.cookie("refreshToken", refreshToken, this.cookieOptions);

        user.lastLogin = new Date();

        await user.save();

        return {
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        };

    }

    async refresh(req, res) {

        const refreshToken = req.cookies.refreshToken;
        console.log("Cookie Header:", req.headers.cookie);
        console.log("Parsed Cookies:", req.cookies);
        console.log("Origin:", req.headers.origin);
        console.log("Cookie Header:", req.headers.cookie);
        console.log("Parsed Cookies:", req.cookies);
        console.log("NODE_ENV:", process.env.NODE_ENV);
        if (!refreshToken) throw new ApiError(401, "Unauthorized.");

        let payload;

        try {

            payload = verifyRefreshToken(refreshToken);

        } catch {

            throw new ApiError(401, "Invalid refresh token.");

        }

        const hashedToken = hashToken(refreshToken);

        const tokenDoc = await refreshTokenRepository.findByToken(hashedToken);

        if (!tokenDoc) throw new ApiError(401, "Session expired.");

        await refreshTokenRepository.deleteByToken(hashedToken);

        const user = await userRepository.findById(payload.id);

        if (!user) throw new ApiError(401, "User not found.");

        const newAccessToken = generateAccessToken(user);

        const newRefreshToken = generateRefreshToken(user);

        const newHashedToken = hashToken(newRefreshToken);

        await refreshTokenRepository.create({
            user: user._id,
            token: newHashedToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ip: req.ip,
            device: req.headers["user-agent"] || ""
        });

        res.cookie("refreshToken", newRefreshToken, this.cookieOptions);

        return {
            accessToken: newAccessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        };

    }

    async logout(req, res) {

        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {

            const hashedToken = hashToken(refreshToken);

            await refreshTokenRepository.deleteByToken(hashedToken);

        }

        res.clearCookie("refreshToken", this.cookieOptions);

    }

    cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    };

    async forgotPassword(email) {

        const user = await userRepository.findByEmail(email);

        /**
         * Prevent email enumeration.
         */
        if (!user) {
            return;
        }

        const resetToken = crypto
            .randomBytes(32)
            .toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const expires =
            new Date(Date.now() + 15 * 60 * 1000);

        await userRepository.savePasswordResetToken(

            user.email,

            hashedToken,

            expires

        );

        const resetLink =

            `${process.env.NODE_ENV == "development" ? process.env.LOCAL_URL : process.env.CLIENT_URL}/reset-password/${resetToken}`;

        await emailService.sendMail({
            to: user.email,
            subject: "Reset your PawPoint password",
            html: resetPasswordTemplate(
                user.firstName,
                resetLink
            )
        });
    }

    async resetPassword(token, newPassword) {
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user =
            await userRepository.findByPasswordResetToken(hashedToken);
        if (!user) {
            throw new ApiError(
                400,
                "Invalid or expired reset link."
            );
        }
        await userRepository.updatePassword(
            user._id,
            newPassword
        );
        await userRepository.clearPasswordReset(
            user._id
        );
        /**
         * Logout from all devices.
         */
        await refreshTokenRepository.deleteAllByUser(
            user._id
        );
    }

    async googleLogin(credential, req, res) {

        let googleUser;

        try {

            googleUser =
                await verifyGoogleToken(
                    credential
                );

        } catch (error) {

            throw new ApiError(
                401,
                "Invalid Google authentication."
            );

        }

        let user =
            await userRepository.findByEmail(
                googleUser.email,
                true
            );

        /*
         * Existing user
         */
        if (user) {

            if (user.isBlocked) {

                throw new ApiError(
                    403,
                    "Account blocked."
                );

            }

            /*
             * Link Google account to an
             * existing email account.
             */
            if (!user.googleId) {

                user.googleId =
                    googleUser.googleId;

            }

            user.authProvider = "google";

            if (
                googleUser.avatar &&
                !user.avatar
            ) {

                user.avatar =
                    googleUser.avatar;

            }

            user.isVerified = true;
            user.lastLogin = new Date();

            await user.save();

        }

        /*
         * New Google user
         */
        else {

            const generatedPassword =
                crypto.randomBytes(32).toString("hex");

            user =
                await userRepository.create({

                    firstName:
                        googleUser.firstName ||
                        "PawPoint",

                    lastName:
                        googleUser.lastName ||
                        "User",

                    email:
                        googleUser.email,

                    password:
                        generatedPassword,

                    googleId:
                        googleUser.googleId,

                    authProvider:
                        "google",

                    avatar:
                        googleUser.avatar,

                    isVerified:
                        true,

                    lastLogin:
                        new Date()

                });

        }

        /*
         * Generate normal PawPoint JWTs.
         */

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        const hashedToken =
            hashToken(refreshToken);

        await refreshTokenRepository.create({

            user: user._id,

            token: hashedToken,

            expiresAt:
                new Date(
                    Date.now() +
                    7 * 24 * 60 * 60 * 1000
                ),

            ip: req.ip,

            device:
                req.headers["user-agent"] || ""

        });

        res.cookie(
            "refreshToken",
            refreshToken,
            this.cookieOptions
        );

        return {

            accessToken,

            user: {

                id: user._id,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                email:
                    user.email,

                role:
                    user.role

            }

        };

    }

}

module.exports = new AuthService();