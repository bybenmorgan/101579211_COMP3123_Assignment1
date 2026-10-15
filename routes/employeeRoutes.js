const express = require("express");
const { checkExact } = require("express-validator");
const authenticate = require("../middleware/authenticate");
const validateRequest = require("../middleware/validateRequest");
const employeeController = require("../controllers/employeeController");

const router = express.Router();

// Every employee route needs a verified user
router.use(authenticate);

router.get(
  "/employees",
  checkExact(),
  validateRequest,
  employeeController.getEmployees,
);

module.exports = router;
