const logger = require("../utils/logger");

function requestLogger(req, res, next) {
  //Save the full path before express handles the route
  const requestPath = req.path;

  res.on("finish", () => {
    logger.info("HTTP request", {
      method: req.method,
      path: requestPath,
      status: res.statusCode
    });
  });

  next();
}

module.exports = requestLogger;