const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");
const { getLogPaths } = require("./src/lib/logger");

const port = Number.parseInt(process.env.PORT || "4000", 10);
const host = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

server.listen(port, host, () => {
  const logPaths = getLogPaths();
  console.log(`NAGECO backend running on http://${host}:${port}`);
  if (logPaths.access && logPaths.error) {
    console.log(`Access log: ${logPaths.access}`);
    console.log(`Error log: ${logPaths.error}`);
  } else {
    console.log("File logging unavailable, using stdout fallback");
  }
});

async function shutdown(signal) {
  console.log(`${signal} received. Closing backend...`);

  server.close(async () => {
    try {
      const prisma = require("./src/lib/prisma");
      await prisma.$disconnect();
    } catch (_error) {
      // Prisma may not be initialized yet during early boot failures.
    }
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
