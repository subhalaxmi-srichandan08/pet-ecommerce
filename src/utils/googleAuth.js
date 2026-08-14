const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

const verifyGoogleToken = async (credential) => {

    if (!credential) {
        throw new Error("Google credential is required.");
    }

    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
        throw new Error("Invalid Google credential.");
    }

    if (!payload.email || !payload.email_verified) {
        throw new Error(
            "Google account email is not verified."
        );
    }

    return {
        googleId: payload.sub,
        email: payload.email.toLowerCase().trim(),
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        avatar: payload.picture || "",
        emailVerified: payload.email_verified,
    };
};

module.exports = {
    verifyGoogleToken,
};