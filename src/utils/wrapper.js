const _ = require("lodash");
const catchAsync = require("./catchAsync");

function wrapper(controller) {
  return _.mapValues(controller, (handler) => catchAsync(handler));
}

module.exports = wrapper;
