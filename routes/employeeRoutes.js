const express = require("express");
const { checkExact } = require("express-validator");
const authenticate = require("../middleware/authenticate");
const validateRequest = require("../middleware/validateRequest");
const employeeController = require("../controllers/employeeController");
const {employeeValidators, employeeIdValidator,} = require("../validators/employeeValidators");
const router = express.Router();

// Every employee route needs a verified user
router.use(authenticate);

router.get(
  "/employees",
  checkExact(),
  validateRequest,
  employeeController.getEmployees,
);

router.post(
  "/employees",
  employeeValidators,
  validateRequest,
  employeeController.createEmployee,
);

router.get(
  "/employees/:eid",
  employeeIdValidator,
  checkExact(),
  validateRequest,
  employeeController.getEmployeeById
);

module.exports = router;
