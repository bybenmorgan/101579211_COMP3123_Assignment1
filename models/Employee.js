const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    salary: {
      type: Number,
      required: true,
      validate: {
        validator: (value) => Number.isFinite(value) && value > 0,
        message: "Salary must be a positive number",
      },
    },
    date_of_joining: {
      type: Date,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    // Store user id of user who made this employee
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

module.exports = mongoose.model("Employee", employeeSchema);
