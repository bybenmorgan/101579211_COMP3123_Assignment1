const express = require("express");
const helmet = require("helmet");
const connectDatabase = require("./config/database");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

// Vercel forwards reqs through proxy
if (process.env.VERCEL) {
  app.set("trust proxy", 1);
}

app.use(requestLogger);
app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

// Connecting here also cause vercel runs the exported app
app.use("/api/v1", async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

module.exports = app;