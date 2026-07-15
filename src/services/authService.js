const crypto = require("crypto");
const userRepository = require("../repositories/userRepository");
const refreshTokenRepository = require("../repositories/refreshTokenRepository");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { hashToken } = require("../utils/tokenHelper");
const ApiError = require("../utils/ApiError");

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
        console.log("Cookies:", JSON.stringify(req.cookies,null,2));
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

}

module.exports = new AuthService();