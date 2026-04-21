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

function loadPrismaClientModule() {
  const localClientPath = path.join(process.cwd(), "node_modules", "@prisma", "client");

  try {
    return require(localClientPath);
  } catch (_error) {
    return require("@prisma/client");
  }
}

function isPrismaMemoryLimitError(error) {
  const message = [
    error && error.message ? error.message : String(error || ""),
    error && error.stderr ? error.stderr : "",
    error && error.stdout ? error.stdout : ""
  ].join("\n");

  return /out of memory|wasm memory|max address space|max resident set/i.test(message);
}

function splitSqlStatements(sqlText) {
  const statements = [];
  let current = "";
  let inSingleQuote = false;

  for (let index = 0; index < sqlText.length; index += 1) {
    const char = sqlText[index];
    const prev = index > 0 ? sqlText[index - 1] : "";

    if (char === "'" && prev !== "\\") {
      inSingleQuote = !inSingleQuote;
      current += char;
      continue;
    }

    if (char === ";" && !inSingleQuote) {
      const statement = current.trim();
      if (statement) {
        statements.push(statement);
      }
      current = "";
      continue;
    }

    current += char;
  }

  const tail = current.trim();
  if (tail) {
    statements.push(tail);
  }

  return statements;
}

function isIgnorableSchemaError(error) {
  const message = error && error.message ? error.message : String(error || "");
  return /already exists|duplicate key value|multiple primary keys|constraint .* already exists|relation .* already exists|type .* already exists/i.test(message);
}

function isPermissionError(error) {
  const message = error && error.message ? error.message : String(error || "");
  return /permission denied|must be owner|not owner|insufficient privilege/i.test(message);
}

async function ensureSchemaIfMissing(prisma) {
  const explicitSkipSchemaInit = process.env.PRISMA_SKIP_SCHEMA_INIT === "true" || process.argv.includes("--skip-schema-init");

  if (explicitSkipSchemaInit) {
    console.log("[bootstrap] PRISMA_SKIP_SCHEMA_INIT enabled. Skipping schema initialization checks.");
    return;
  }

  const probe = await prisma.$queryRawUnsafe(
    "SELECT c.relname AS table_name FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relname IN ('User', 'SiteSettings')"
  );

  const existingTableNames = new Set(
    (Array.isArray(probe) ? probe : [])
      .map((row) => (row && typeof row.table_name === "string" ? row.table_name : ""))
      .filter(Boolean)
  );

  const hasUserTable = existingTableNames.has("User");
  const hasSiteSettingsTable = existingTableNames.has("SiteSettings");

  if (hasUserTable && hasSiteSettingsTable) {
    console.log("[bootstrap] Schema check: required tables already exist.");
    return;
  }

  const initSqlPath = path.join(process.cwd(), "scripts", "cpanel-init.sql");
  if (!fs.existsSync(initSqlPath)) {
    throw new Error(`Schema missing and ${initSqlPath} was not found.`);
  }

  console.log("[bootstrap] Schema check: missing tables detected. Applying scripts/cpanel-init.sql...");
  const sqlText = fs.readFileSync(initSqlPath, "utf8");
  // cPanel ships PostgreSQL 9.2 on some hosts, which supports JSON but not JSONB.
  const normalizedSqlText = sqlText.replace(/\bJSONB\b/gi, "JSON");
  const statements = splitSqlStatements(normalizedSqlText);

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (error) {
      if (isIgnorableSchemaError(error)) {
        continue;
      }

      if (isPermissionError(error)) {
        throw new Error(
          "Database user lacks permission to create schema objects. " +
          "In cPanel PostgreSQL Databases, add the DB user to the DB with ALL PRIVILEGES, then run bootstrap:cpanel again."
        );
      }

      throw error;
    }
  }

  console.log("[bootstrap] Schema SQL applied.");
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
  const { PrismaClient, Role } = loadPrismaClientModule();

  const prisma = new PrismaClient();

  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be defined");
    }

    await ensureSchemaIfMissing(prisma);

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