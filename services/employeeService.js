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

async function updateEmployee(employeeId, data, userId) {
  // check the ownership before changes
  const employee = await getEmployeeById(employeeId, userId);

  employee.set({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    position: data.position,
    salary: data.salary,
    date_of_joining: data.date_of_joining,
    department: data.department,
  });

  return employee.save();
}

async function deleteEmployee(employeeId, userId) {
  await getEmployeeById(employeeId, userId);

  // Include owner the delete queries
  const result = await Employee.deleteOne({
    _id: employeeId,
    user: userId,
  });

  if (result.deletedCount === 0) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
