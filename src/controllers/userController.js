const _ = require("lodash");
const User = require("../models/user");
const AppError = require("../utils/appError");
const wrapper = require("../utils/wrapper");
const sendResponse = require("../utils/sendResponse");

const userController = {
  getUserById: async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    sendResponse(res, { user }, 200);
  },

  updateUserInfo: async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (req.body.id && req.body.id !== userId) {
      throw new AppError("You are not allowed to change information of another person", 400);
    }

    const updatedUser = _.merge(user, req.body);
    await updatedUser.save();
    sendResponse(res, { user: updatedUser }, 200);
  },

  updateUserPassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");

    if (!user.comparePassword(currentPassword)) {
      throw new AppError("Current password is incorrect", 400);
    }

    user.password = newPassword;
    const { password, ...rest } = _.get(await user.save(), '_doc');

    sendResponse(res, { user: rest }, 200);
  },
}

module.exports = wrapper(userController);
