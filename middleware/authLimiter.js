const { rateLimit } = require("express-rate-limit");

// slow down multiple repeated sign up and logins from the same IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    const error = new Error(
      "Too many authentication requests. Try again shortly."
    );

    error.status = 429;
    next(error);
  }
});

module.exports = authLimiter;