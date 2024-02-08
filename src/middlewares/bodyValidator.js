const ajv = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

function bodyValidator(schemaName) {
  return catchAsync(async (req, res, next) => {
    const validate = ajv.getSchema(schemaName);
    const valid = validate(req.body);

    if (!valid) {
      throw new AppError(ajv.errorsText(validate.errors), 400);
    }

    next();
  });
}

module.exports = bodyValidator;
