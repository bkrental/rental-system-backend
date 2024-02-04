const bcrypt = require("bcrypt");
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
    const { name, email, password, phone } = req.body;

    if (!name || !phone || !email || !password) {
      throw new AppError("Missing fields", 400);
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      access_token: generateToken(newUser),
    });
  },

  login: async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
      throw new AppError("Missing fields", 400);
    }

    const user = await User.findOne({ phone }).select("+password");
    if (!user) {
      throw new AppError("User not found", 400);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid password", 400);
    }

    res.status(200).json({
      status: "success",
      access_token: generateToken(user),
    });
  },
};

module.exports = wrapper(authController);
