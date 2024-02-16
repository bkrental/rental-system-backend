function sendResponse(res, data, statusCode = 200, customFields = {}) {
  return res.status(statusCode).json({
    status: "success",
    ...customFields,
    data,
  });
}

module.exports = sendResponse;
