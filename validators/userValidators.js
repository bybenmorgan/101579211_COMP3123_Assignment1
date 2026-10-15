const { body, checkExact, oneOf } = require("express-validator");

const signupValidators = [
  body("username")
    .isString().withMessage("Username is needed and must be text")
    .bail()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .bail()
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("Username can contain have letters, numbers, and underscores"),

  body("email")
    .isString().withMessage("Email is needed and must be text")
    .bail()
    .trim()
    .isEmail().withMessage("Enter a valid email address")
    .bail()
    .isLength({ max: 254 })
    .withMessage("Email must not be more than 254 characters")
    .toLowerCase(),

  body("password")
    .isString().withMessage("Password is needed and must be text")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain a letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    // bcrypt uses the 1st 72 bytes of a pass
    .custom(value => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 bytes"),

 // Reject xtra fields that are not part of sign up  
  checkExact()
];

const loginValidators = [
  // Login needs a user or email
  oneOf(
    [body("username").exists(), body("email").exists()],
    { message: "Enter a username or email" }
  ),

  body("username")
    .optional()
    .isString().withMessage("Username must be text")
    .bail()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),

  body("email")
    .optional()
    .isString().withMessage("Email must be text")
    .bail()
    .trim()
    .isEmail().withMessage("Enter a valid email address")
    .bail()
    .isLength({ max: 254 })
    .withMessage("Email must not exceed 254 characters")
    .toLowerCase(),

  body("password")
    .isString().withMessage("Password is needed and must be text")
    .bail()
    .notEmpty().withMessage("Enter your password")
    .bail()
    .custom(value => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Password must not exceed 72 bytes"),

  checkExact()
];

module.exports = { signupValidators, loginValidators };