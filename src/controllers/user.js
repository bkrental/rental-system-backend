const User = require("../models/user");
const _ = require("lodash");

const userController = {
  getAllUsers: async (req, res) => {
    const users = await User.find({});
    res.send(JSON.stringify(users));
  },

  createUser: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.create({ firstName, lastName, email, password });
    await user.save();
    res.send(
      JSON.stringify(_.pick(user, ["id", "firstName", "lastName", "email"]))
    );
  },
};

module.exports = userController;
