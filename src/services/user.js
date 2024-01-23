const User = require("../models/user");

const userService = {
  createUser: async (user) => {
    const { firstName, lastName, email, password } = user;
    const newUser = await User.create({ firstName, lastName, email, password });
    return newUser;
  },

  getUserByEmail: async (email) => {
    const user = await User.findOne({ email });
    return user;
  },

  getUserById: async (id) => {
    const user = await User.findById(id);
    return user;
  },
};

module.exports = userService;
