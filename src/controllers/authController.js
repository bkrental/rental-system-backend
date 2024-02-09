const _ = require("lodash");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const wrapper = require("../utils/wrapper");
const User = require("../models/user");

function generateToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
}

const authController = {
  signUp: async (req, res) => {
    const user = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        access_token: generateToken(user),
        user,
      },
    });
  },

  login: async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
      throw new AppError("Missing fields", 400);
    }

    const user = await User.findOne({ phone }).select("+password");

    if (!user || !user.comparePassword(password)) {
      throw new AppError("Incorect phone or password", 400);
    }

    res.status(200).json({
      status: "success",
      data: {
        access_token: generateToken(user),
        user: _.pick(user, ["name", "email", "phone"]),
      },
    });
  },
};

module.exports = wrapper(authController);
