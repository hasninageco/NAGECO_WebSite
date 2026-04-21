const { writeErrorLog } = require("../lib/logger");

function notFoundHandler(req, res, _next) {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      ok: false,
      error: "API route not found",
      path: req.originalUrl || req.url
    });
  }

  return res.status(404).json({
    ok: false,
    error: "Not found",
    path: req.originalUrl || req.url
  });
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    writeErrorLog(err, {
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode
    });
    console.error(err);
  }

  res.status(statusCode).json({
    ok: false,
    error: statusCode === 500 ? "Internal server error" : err.message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
