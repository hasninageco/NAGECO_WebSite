const http = require("http");
const next = require("next");
const dotenv = require("dotenv");

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOST || "0.0.0.0";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => handle(req, res))
      .listen(port, hostname, () => {
        console.log(`NAGECO running on http://${hostname}:${port} (${process.env.NODE_ENV || "development"})`);
      });
  })
  .catch((error) => {
    console.error("Failed to start Next.js server", error);
    process.exit(1);
  });
