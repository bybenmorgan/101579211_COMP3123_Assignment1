const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const result = validationResult(req);

  // Let valid reqs continue to controller
  if (result.isEmpty()) {
    return next();
  }

  const error = new Error("Validation failed");
  error.status = 400;
  // Leave out submitted values so that passwords don't get sent back
  error.details = result.array({ onlyFirstError: true }).map(item => ({
    field: item.type === "field" ? item.path : "request",
    message: item.msg
  }));

  next(error);
}

module.exports = validateRequest;