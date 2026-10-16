const Employee = require("../models/Employee");

async function getEmployees(userId) {
  // only give employees owned by this user
  return Employee.find({ user: userId });
}

async function createEmployee(data, userId) {
  return Employee.create({
    ...data,
    // Set  owner using the authenticated user
    user: userId,
  });
}

async function getEmployeeById(employeeId, userId) {
  const employee = await Employee.findOne({
    _id: employeeId,
    user: userId,
  });

  if (employee) {
    return employee;
  }

  // distinguish a missing employee from one owned by someoe else
  const exists = await Employee.exists({ _id: employeeId });

  const error = new Error(
    exists ? "Employee belongs to another user" : "Employee not found",
  );
  error.status = exists ? 403 : 404;
  throw error;
}

module.exports = { getEmployees, createEmployee, getEmployeeById };
