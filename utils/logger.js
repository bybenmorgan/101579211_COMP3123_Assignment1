const fs = require("node:fs");
const path = require("node:path");
const winston = require("winston");

const logDirectory = path.join(__dirname, "..", "logs");

fs.mkdirSync(logDirectory, { recursive: true });

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, "app.log")
    })
  ]
});

module.exports = logger;