const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const wrapper = require("../utils/wrapper");
const User = require("../models/user");

function generateToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
}

const sendAuthResponse = (res, user) => {
  return res.status(200).json({
    status: "success",
    data: {
      access_token: generateToken(user),
      user: _.pick(user, ["id", "name", "phone", "avatar"]),
    },
  });
};

const authController = {
  signUp: async (req, res) => {
    const user = await User.create(req.body);

    sendAuthResponse(res, user);
  },

  login: async (req, res) => {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).select("+password");

    if (!user || !user.comparePassword(password)) {
      throw new AppError("Incorect phone or password", 400);
    }

    sendAuthResponse(res, user);
  },
};

module.exports = wrapper(authController);
