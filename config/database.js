const mongoose = require("mongoose");

let connectionPromise;

async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .finally(() => {
        connectionPromise = null;
      });
  }

  await connectionPromise;
}

module.exports = connectDatabase;