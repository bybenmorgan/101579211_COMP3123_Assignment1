const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function signup({ username, email, password }) {
  try {
    // wait for unique indexes before creating the user
    await User.init();

    const user = await User.create({
      username,
      email,
      password,
    });

    // Leave the passw hash out of the response
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    if (error.code === 11000) {
      const conflict = new Error("Username or email is already registered");
      conflict.status = 409;
      throw conflict;
    }

    throw error;
  }
}

async function login({ username, email, password }) {
  const query = username ? { username } : { email };

  // Include the hash here to check the password
  const user = await User.findOne(query).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid username, email, or password");
    error.status = 401;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1h" },
  );

  // return token and user details without the pass hash
  return {
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
}

module.exports = { signup, login };
