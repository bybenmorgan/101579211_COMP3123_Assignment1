const employeeService = require("../services/employeeService");
const logger = require("../utils/logger");

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

module.exports = { getEmployees };
