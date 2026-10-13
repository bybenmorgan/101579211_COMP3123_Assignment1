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
      userId: user._id.toString()
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { signup };