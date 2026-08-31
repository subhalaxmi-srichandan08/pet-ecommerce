const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    logo: {
      type: String,
      default: "",
    },

    logoAlt: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    website: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Brand",
  brandSchema
);