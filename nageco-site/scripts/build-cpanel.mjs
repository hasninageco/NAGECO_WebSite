import { spawn } from "node:child_process";
import path from "node:path";

const nextCli = path.resolve(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const nodeOptions = [process.env.NODE_OPTIONS, "--max-old-space-size=3072"]
  .filter(Boolean)
  .join(" ")
  .trim();

const env = {
  ...process.env,
  LOW_MEMORY_BUILD: "1",
  NEXT_PRIVATE_BUILD_WORKER: process.env.NEXT_PRIVATE_BUILD_WORKER ?? "1",
  NEXT_TELEMETRY_DISABLED: "1",
  NODE_OPTIONS: nodeOptions
};

const child = spawn(process.execPath, [nextCli, "build", "--no-lint"], {
  env,
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Build process exited with signal ${signal}.`);
    process.exit(1);
  }

  process.exit(code ?? 1);
});
