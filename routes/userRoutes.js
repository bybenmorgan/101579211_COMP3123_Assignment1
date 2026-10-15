const express = require("express");
const authController = require("../controllers/authController");
const authLimiter = require("../middleware/authLimiter");
const {
  signupValidators,
  loginValidators,
} = require("../validators/userValidators");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

//Limit requests and check input before handling sign up
router.post(
  "/signup",
  authLimiter,
  signupValidators,
  validateRequest,
  authController.signup,
);

router.post(
  "/login",
  authLimiter,
  loginValidators,
  validateRequest,
  authController.login,
);

module.exports = router;
