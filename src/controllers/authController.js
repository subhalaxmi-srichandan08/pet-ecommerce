const User =
  require("../models/User");

const generateToken =
  require("../utils/generateToken");

const register = async (
  req,
  res
) => {

  try {

    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

    const exists =
      await User.findOne({
        email
      });

    if (exists) {

      return res.status(400).json({
        success: false,
        message:
          "Email already exists"
      });
    }

    const user =
      await User.create({
        firstName,
        lastName,
        email,
        password
      });

    res.status(201).json({
      success: true,
      token:
        generateToken(user._id),
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      });

    if (
      !user ||
      !(await user.matchPassword(
        password
      ))
    ) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials"
      });
    }

    res.json({
      success: true,
      token:
        generateToken(user._id),
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  register,
  login
};