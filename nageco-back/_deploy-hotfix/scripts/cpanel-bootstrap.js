const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

try {
  require("dotenv").config();
} catch (_error) {
  // Environment variables can also be injected directly by cPanel.
}

function runNodeCommand(scriptPath, args, label, envOverrides = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n[bootstrap] ${label}`);

    let stderrOutput = "";
    let stdoutOutput = "";

    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...envOverrides
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    child.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdoutOutput += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      stderrOutput += text;
      process.stderr.write(text);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const error = new Error(`${label} failed with exit code ${code}`);
        error.stdout = stdoutOutput;
        error.stderr = stderrOutput;
        reject(error);
      }
    });
  });
}

function hasPrismaMigrations() {
  const migrationsRoot = path.join(process.cwd(), "prisma", "migrations");

  try {
    if (!fs.existsSync(migrationsRoot)) {
      return false;
    }

    const entries = fs.readdirSync(migrationsRoot, { withFileTypes: true });
    return entries.some((entry) => entry.isDirectory());
  } catch (_error) {
    return false;
  }
}

function hasGeneratedPrismaClient() {
  const generatedClientPath = path.join(process.cwd(), "node_modules", ".prisma", "client", "index.js");
  return fs.existsSync(generatedClientPath);
}

function isPrismaMemoryLimitError(error) {
  const message = [
    error && error.message ? error.message : String(error || ""),
    error && error.stderr ? error.stderr : "",
    error && error.stdout ? error.stdout : ""
  ].join("\n");

  return /out of memory|wasm memory|max address space|max resident set/i.test(message);
}

async function runPrismaSetupIfAvailable() {
  let prismaCliPath;
  const explicitSkip = process.env.PRISMA_SKIP_CLI === "true" || process.argv.includes("--skip-prisma");
  const prismaNodeOptions = [process.env.NODE_OPTIONS || "", "--max-old-space-size=512"].join(" ").trim();

  if (explicitSkip) {
    console.log("[bootstrap] PRISMA_SKIP_CLI enabled. Skipping prisma generate/migrate steps.");
    return;
  }

  try {
    prismaCliPath = require.resolve("prisma/build/index.js");
  } catch (_error) {
    console.log("[bootstrap] Prisma CLI not found. Skipping generate/migrate steps.");
    return;
  }

  try {
    await runNodeCommand(prismaCliPath, ["generate"], "prisma generate", {
      NODE_OPTIONS: prismaNodeOptions
    });

    if (hasPrismaMigrations()) {
      await runNodeCommand(prismaCliPath, ["migrate", "deploy"], "prisma migrate deploy", {
        NODE_OPTIONS: prismaNodeOptions
      });
    } else {
      console.log("[bootstrap] prisma/migrations not found. Falling back to prisma db push.");
      await runNodeCommand(prismaCliPath, ["db", "push"], "prisma db push", {
        NODE_OPTIONS: prismaNodeOptions
      });
    }
  } catch (error) {
    if (isPrismaMemoryLimitError(error)) {
      if (!hasGeneratedPrismaClient()) {
        throw new Error(
          "Prisma CLI hit memory limits and no generated client was found at node_modules/.prisma/client. " +
          "Run prisma generate in a higher-memory environment, then deploy node_modules with generated Prisma client."
        );
      }

      console.log("[bootstrap] Prisma CLI hit memory limits. Skipping generate/migrate and continuing with existing generated client.");
      return;
    }

    if (hasGeneratedPrismaClient()) {
      console.log("[bootstrap] Prisma setup failed, but pre-generated client exists. Continuing without prisma CLI.");
      return;
    }

    throw error;
  }
}

async function seedDefaults() {
  const bcrypt = require("bcryptjs");
  const { PrismaClient, Role } = require("@prisma/client");

  const prisma = new PrismaClient();

  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: Role.ADMIN,
        name: "NAGECO Admin"
      },
      create: {
        email,
        passwordHash,
        role: Role.ADMIN,
        name: "NAGECO Admin"
      }
    });

    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        id: "singleton",
        brandName: "NAGECO",
        tagline: "Geophysical exploration and subsurface intelligence",
        phones: [],
        emails: [],
        socialLinksJson: {}
      }
    });

    console.log("[bootstrap] Seed completed");
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log("[bootstrap] Starting cPanel bootstrap...");
  await runPrismaSetupIfAvailable();
  await seedDefaults();
  console.log("[bootstrap] Done");
}

main().catch((error) => {
  console.error("[bootstrap] Failed", error && error.message ? error.message : error);
  process.exit(1);
});