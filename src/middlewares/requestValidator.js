const ajv = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

function requestValidator(schema_name, validateItem = "body") {
  return catchAsync(async (req, res, next) => {
    const validate = ajv.getSchema(schema_name);
    const valid = validate(req[validateItem]);

    if (!valid) {
      throw new AppError(ajv.errorsText(validate.errors), 400);
    }

    next();
  });
}

module.exports = requestValidator;
