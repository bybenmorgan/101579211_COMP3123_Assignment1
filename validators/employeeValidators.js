const { body, param, query, checkExact } = require("express-validator");

const employeeValidators = [
  body("first_name")
    .isString()
    .withMessage("First name is required and must be text")
    .bail()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1 and 50 characters"),

  body("last_name")
    .isString()
    .withMessage("Last name is required and must be text")
    .bail()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1 and 50 characters"),

  body("email")
    .isString()
    .withMessage("Email is required and must be text")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .bail()
    .isLength({ max: 254 })
    .withMessage("Email must not exceed 254 characters")
    .toLowerCase(),

  body("position")
    .isString()
    .withMessage("Position is required and must be text")
    .bail()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Position must be between 1 and 100 characters"),

  body("salary")
    .custom((value) => Number.isFinite(value) && value > 0)
    .withMessage("Salary must be a positive number"),

  body("date_of_joining")
    .isString()
    .withMessage("Date of joining is required")
    .bail()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Use YYYY-MM-DD for the date of joining")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("Enter a valid date of joining")
    .bail()
    .toDate(),

  body("department")
    .isString()
    .withMessage("Department is required and must be text")
    .bail()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Department must be between 1 and 100 characters"),

  // owner comes from token, so user is not allowed as input
  checkExact(),
];

const employeeIdValidator = param("eid")
  .isMongoId()
  .withMessage("Enter a valid employee ID");

const deleteEmployeeIdValidator = query("eid")
  .isString()
  .withMessage("Employee ID is required and must be text")
  .bail()
  .isMongoId()
  .withMessage("Enter a valid employee ID");

module.exports = {
  employeeValidators,
  employeeIdValidator,
  deleteEmployeeIdValidator,
};
