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

async function getEmployeeById(req, res, next) {
  try {
    const { eid } = matchedData(req, { locations: ["params"] });
    const employee = await employeeService.getEmployeeById(eid, req.user._id);

    logger.info("Employee retrieved", {
      employeeId: employee._id.toString(),
      userId: req.user._id.toString(),
    });

    res.status(200).json({ employee });
  } catch (error) {
    next(error);
  }
}

async function updateEmployee(req, res, next) {
  try {
    const { eid } = matchedData(req, { locations: ["params"] });
    const data = matchedData(req, { locations: ["body"] });

    const employee = await employeeService.updateEmployee(
      eid,
      data,
      req.user._id,
    );

    logger.info("Employee updated", {
      employeeId: employee._id.toString(),
      userId: req.user._id.toString(),
    });

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEmployee(req, res, next) {
  try {
    const { eid } = matchedData(req, { locations: ["query"] });
    await employeeService.deleteEmployee(eid, req.user._id);

    logger.info("Employee deleted", {
      employeeId: eid,
      userId: req.user._id.toString(),
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
