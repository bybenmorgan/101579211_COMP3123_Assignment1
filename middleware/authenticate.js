const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function authenticate(req, res, next) {
  const authorization = req.get("Authorization") || "";
  const tokenMatch = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!tokenMatch) {
    const error = new Error("A Bearer token is required");
    error.status = 401;
    return next(error);
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Check signature and expiry before using token
    const payload = jwt.verify(tokenMatch[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      !payload ||
      typeof payload.userId !== "string" ||
      !mongoose.isObjectIdOrHexString(payload.userId)
    ) {
      const error = new Error("Invalid authentication token");
      error.status = 401;
      throw error;
    }

    const user = await User.findById(payload.userId).select("_id");

    if (!user) {
      const error = new Error("Authenticated user no longer exists");
      error.status = 401;
      throw error;
    }

    // employee routes use this user to see ownership
    req.user = user;
    next();
  } catch (error) {
    const tokenErrors = [
      "JsonWebTokenError",
      "TokenExpiredError",
      "NotBeforeError",
    ];

    if (tokenErrors.includes(error.name)) {
      const authError = new Error(
        error.name === "TokenExpiredError"
          ? "Authentication token has expired"
          : "Invalid authentication token",
      );
      authError.status = 401;
      return next(authError);
    }

    next(error);
  }
}

module.exports = authenticate;
