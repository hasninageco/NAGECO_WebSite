import { access, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const rootDir = process.cwd();
  const nextDir = path.join(rootDir, ".next");
  const standaloneDir = path.join(nextDir, "standalone");
  const staticDir = path.join(nextDir, "static");
  const publicDir = path.join(rootDir, "public");
  const outputDir = path.join(rootDir, "dist-standalone");

  if (!(await exists(standaloneDir))) {
    throw new Error("Standalone output not found. Run `npm run build:standalone` first.");
  }

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await cp(standaloneDir, outputDir, { recursive: true });

  if (await exists(staticDir)) {
    await mkdir(path.join(outputDir, ".next"), { recursive: true });
    await cp(staticDir, path.join(outputDir, ".next", "static"), { recursive: true });
  }

  if (await exists(publicDir)) {
    await cp(publicDir, path.join(outputDir, "public"), { recursive: true });
  }

  const envFiles = [
    ".env",
    ".env.local",
    ".env.production",
    ".env.production.local"
  ];

  for (const envFile of envFiles) {
    await rm(path.join(outputDir, envFile), { force: true });
  }

  console.log("Standalone artifact created in dist-standalone/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
