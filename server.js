require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");
const logger = require("./utils/logger");

const PORT = Number(process.env.PORT || 8081);

async function startServer() {
  try {
    await connectDatabase();
    logger.info("MongoDB connected");

    app.listen(PORT, () => {
      logger.info(`API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed", {
      errorType: error.name
    });

    process.exitCode = 1;
    logger.end();
  }
}

startServer();