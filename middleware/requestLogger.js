const logger = require("../utils/logger");

function requestLogger(req, res, next) {
  res.on("finish", () => {
    logger.info("HTTP request", {
      method: req.method,
      path: req.path,
      status: res.statusCode
    });
  });

  next();
}

module.exports = requestLogger;