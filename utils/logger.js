const fs = require("node:fs");
const path = require("node:path");
const winston = require("winston");

const transports = [new winston.transports.Console()];

// save a log file when running local
if (!process.env.VERCEL) {
  const logDirectory = path.join(__dirname, "..", "logs");
  fs.mkdirSync(logDirectory, { recursive: true });

  transports.push(
    new winston.transports.File({
      filename: path.join(logDirectory, "app.log"),
    }),
  );
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports,
});

module.exports = logger;