const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const wrapper = require("../utils/wrapper");

function generateToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
}

const authController = {
  signUp: async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !phone || !email || !password) {
      throw new AppError("Missing fields", 400);
    }

    const existingUser = await userService.getUserByPhone(phone);
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userService.createUser({
      firstName,
      lastName,
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

    const user = await userService.getUserByPhone(phone);
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
