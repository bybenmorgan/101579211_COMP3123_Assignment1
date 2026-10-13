const express = require("express");
const authController = require("../controllers/authController");
const authLimiter = require("../middleware/authLimiter");
const { signupValidators } = require("../validators/userValidators");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

//Limit requests and check input before handling sign up
router.post(
  "/signup",
  authLimiter,
  signupValidators,
  validateRequest,
  authController.signup
);

module.exports = router;