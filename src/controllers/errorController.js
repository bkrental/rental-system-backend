const _ = require("lodash");
const AppError = require("../utils/appError");

// MongoDB Error Handling
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  console.log(err.errmsg);
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(" ")}`;
  return new AppError(message, 400);
};

function sendErrorProd(err, req, res) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
}

function sendErrorDev(err, req, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
}

function errorHandler(err, req, res, _next) {
  let appError = _.merge({ statusCode: 500, status: "error" }, err);

  if (err.name === "CastError") appError = handleCastErrorDB(err);
  if (err.code === 11000) appError = handleDuplicateFieldsDB(err);
  if (err.name === "ValidationError") appError = handleValidationErrorDB(err);

  if (process.env.NODE_ENV === "prod") {
    return sendErrorProd(appError, req, res);
  }

  return sendErrorDev(appError, req, res);
}

module.exports = errorHandler;
