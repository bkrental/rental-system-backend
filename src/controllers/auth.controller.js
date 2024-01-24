const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");

function generateToken(user) {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  return token;
}

const authController = {
  signUp: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send("Missing fields");
    }

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userService.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      access_token: generateToken(newUser),
    });
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Missing fields");
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    res.json({
      status: "success",
      access_token: generateToken(user),
    });
  },
};

module.exports = authController;
