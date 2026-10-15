const { matchedData } = require("express-validator");
const authService = require("../services/authService");
const logger = require("../utils/logger");

async function signup(req, res, next) {
  try {
    logger.info("Signup attempt");

    // only use fields that passed validation
    const data = matchedData(req, { locations: ["body"] });
    const user = await authService.signup(data);

    logger.info("User registered", {
      userId: user._id.toString(),
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    logger.info("Login attempt");

    const data = matchedData(req, { locations: ["body"] });
    const result = await authService.login(data);

    logger.info("Login successful", {
      userId: result.user._id.toString(),
    });

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup, login };
