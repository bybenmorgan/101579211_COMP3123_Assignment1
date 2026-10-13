const User = require("../models/User");

async function signup({ username, email, password }) {
  try {
    // wait for unique indexes before creating the user
    await User.init();

    const user = await User.create({
      username,
      email,
      password
    });

    // Leave the passw hash out of the response
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
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

module.exports = { signup };