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

module.exports = { getEmployees, createEmployee };