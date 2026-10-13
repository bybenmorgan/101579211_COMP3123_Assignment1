require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = Number(process.env.PORT || 8081);

async function startServer() {
  try {
    await connectDatabase();
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.name);
    process.exit(1);
  }
}

startServer();