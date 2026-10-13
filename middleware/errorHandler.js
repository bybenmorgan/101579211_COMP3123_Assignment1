const logger = require("../utils/logger");

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let status = error.status || 500;
  let message = status >= 500
    ? "Internal server error"
    : error.message;

  if (error.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON request";
  }

  logger.log(status >= 500 ? "error" : "warn", "Request failed", {
    method: req.method,
    path: req.path,
    status,
    errorType: error.name,
    reason: message
  });

const response = { error: message };

// Keep xtra details out of server error responses
if (status < 500 && error.details) {
  response.details = error.details;
}

res.status(status).json(response);
}

module.exports = errorHandler;