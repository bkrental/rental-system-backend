const User = require("../models/User");

const userService = {
  createUser: async (user) => {
    const newUser = await User.create(user);
    return newUser;
  },

  getUserByEmail: async (email) => {
    const user = await User.findOne({ email });
    return user;
  },

  getUserByPhone: async (phone) => {
    const user = await User.findOne({ phone });
    return user;
  },

  getUserById: async (id) => {
    const user = await User.findById(id);
    return user;
  },
};

module.exports = userService;
