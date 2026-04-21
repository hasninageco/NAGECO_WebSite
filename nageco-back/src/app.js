const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const { accessLogStream } = require("./lib/logger");

const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/error-handler");

const app = express();

app.set("trust proxy", 1);

const rawBasePath = (process.env.BASE_PATH || "").trim();
const basePath = rawBasePath && rawBasePath !== "/"
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";
const mountedBasePaths = Array.from(new Set([
  "/",
  "/nag-back",
  "/nageco-back",
  basePath
].filter(Boolean)));

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin blocked"));
    },
    credentials: true
  })
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: accessLogStream
  })
);

app.use((req, _res, next) => {
  if (req.url === "/index.php") {
    req.url = "/";
    return next();
  }

  if (req.url.endsWith("/index.php")) {
    req.url = req.url.slice(0, -"/index.php".length) || "/";
  }

  return next();
});

const serviceRouter = express.Router();

serviceRouter.get("/", (_req, res) => {
  res.json({
    service: "nageco-back",
    ok: true,
    basePath: basePath || "/",
    mountedBasePaths
  });
});

serviceRouter.use("/api", apiRoutes);

for (const mountPath of mountedBasePaths) {
  if (mountPath === "/") {
    app.use(serviceRouter);
  } else {
    app.use(mountPath, serviceRouter);
  }
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
