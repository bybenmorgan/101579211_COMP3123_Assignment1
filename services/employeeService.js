const Employee = require("../models/Employee");

async function getEmployees(userId) {
  // only give employees owned by this user
  return Employee.find({ user: userId });
}

module.exports = { getEmployees };
