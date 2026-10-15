const employeeService = require("../services/employeeService");
const logger = require("../utils/logger");
const { matchedData } = require("express-validator");

async function getEmployees(req, res, next) {
  try {
    const employees = await employeeService.getEmployees(req.user._id);

    logger.info("Employees retrieved", {
      userId: req.user._id.toString(),
      count: employees.length,
    });

    res.status(200).json({ employees });
  } catch (error) {
    next(error);
  }
}

async function createEmployee(req, res, next) {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const employee = await employeeService.createEmployee(data, req.user._id);

    logger.info("Employee created", {
      employeeId: employee._id.toString(),
      userId: req.user._id.toString(),
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getEmployees, createEmployee };