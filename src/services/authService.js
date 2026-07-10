const userRepository = require("../repositories/userRepository");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

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

        const token =
            generateToken(user._id);

        return {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        };

    }

    async login(email, password) {

        const user =
            await userRepository.findByEmail(
                email,
                true
            );

        if (!user) {
            throw new Error("Invalid email or password.");
        }

        if (user.isBlocked) {
            throw new Error("Your account has been blocked.");
        }

        const isMatch =
            await user.comparePassword(password);

        if (!isMatch) {
            throw new Error("Invalid email or password.");
        }

        await userRepository.updateLastLogin(user._id);

        const token =
            generateToken(user._id);

        return {

            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },

            token

        };

    }

}

module.exports = new AuthService();