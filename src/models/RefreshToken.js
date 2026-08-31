const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true

    },

    token: {

        type: String,

        required: true

    },

    expiresAt: {

        type: Date,

        required: true,

        index: true

    },

    device: {

        type: String,

        default: ""

    },

    ip: {

        type: String,

        default: ""

    }

}, {

    timestamps: true

});



module.exports = mongoose.model(
    "RefreshToken",
    refreshTokenSchema
);