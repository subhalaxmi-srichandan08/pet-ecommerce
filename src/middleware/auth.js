const { verifyAccessToken } = require("../utils/jwt");

module.exports = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyAccessToken(token);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }

};