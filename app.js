const express = require("express");
const helmet = require("helmet");
const requestLogger = require("./middleware/requestLogger");

const app = express();

app.use(requestLogger);
app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running"
  });
});

module.exports = app;