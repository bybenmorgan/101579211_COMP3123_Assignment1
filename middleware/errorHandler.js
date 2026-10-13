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
    errorType: error.name
  });

  res.status(status).json({ error: message });
}

module.exports = errorHandler;