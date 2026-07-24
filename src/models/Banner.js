const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    subtitle: {
      type: String,
      default: "",
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      maxlength: 600,
    },

    desktopImage: {
      type: String,
      required: true,
    },

    mobileImage: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "Shop Now",
    },

    buttonLink: {
      type: String,
      default: "/products",
    },

    backgroundColor: {
      type: String,
      default: "#ffffff",
    },

    badge: {
      type: String,
      default: "",
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

bannerSchema.index({
  displayOrder: 1,
});

bannerSchema.index({
  isActive: 1,
});

module.exports = mongoose.model(
  "Banner",
  bannerSchema
);