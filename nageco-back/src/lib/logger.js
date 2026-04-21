const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..", "..");
const configuredDirectory = (process.env.LOG_DIR || "").trim();
const logDirectory = configuredDirectory
  ? path.resolve(projectRoot, configuredDirectory)
  : path.join(projectRoot, "logs");

let accessLogPath = path.join(logDirectory, "access.log");
let errorLogPath = path.join(logDirectory, "error.log");
let accessFileStream = null;
let fileLoggingEnabled = false;

try {
  fs.mkdirSync(logDirectory, { recursive: true });
  fs.closeSync(fs.openSync(accessLogPath, "a"));
  fs.closeSync(fs.openSync(errorLogPath, "a"));
  accessFileStream = fs.createWriteStream(accessLogPath, { flags: "a" });
  fileLoggingEnabled = true;
} catch (error) {
  accessLogPath = null;
  errorLogPath = null;
  fileLoggingEnabled = false;
  console.error("File logging disabled, fallback to stdout", error && error.message ? error.message : error);
}

const accessLogStream = {
  write(message) {
    if (fileLoggingEnabled && accessFileStream) {
      accessFileStream.write(message);
    }

    if (process.env.LOG_TO_STDOUT !== "false") {
      process.stdout.write(message);
    }
  }
};

function writeErrorLog(error, context = {}) {
  const payload = {
    time: new Date().toISOString(),
    message: error && error.message ? error.message : String(error),
    stack: error && error.stack ? error.stack : null,
    context
  };

  if (!fileLoggingEnabled || !errorLogPath) {
    console.error(JSON.stringify(payload));
    return;
  }

  try {
    fs.appendFileSync(errorLogPath, `${JSON.stringify(payload)}\n`, "utf8");
  } catch (writeError) {
    console.error("Failed to write error.log", writeError);
  }
}

function getLogPaths() {
  return {
    directory: logDirectory,
    access: accessLogPath,
    error: errorLogPath
  };
}

module.exports = {
  accessLogStream,
  getLogPaths,
  writeErrorLog
};