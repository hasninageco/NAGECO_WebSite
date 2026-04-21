import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);

function readEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function createClient(url) {
  return new PrismaClient({
    datasources: {
      db: { url }
    },
    log: ["warn", "error"]
  });
}

function quoteIdent(value) {
  return `"${value.replaceAll("\"", "\"\"")}"`;
}

function quoteLiteral(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function stablePreferredOrder(tables) {
  const preferred = ["User", "SiteSettings", "PageContent", "Media", "Post", "Project", "Tender"];
  const seen = new Set();
  const ordered = [];

  for (const table of preferred) {
    if (tables.includes(table) && !seen.has(table)) {
      seen.add(table);
      ordered.push(table);
    }
  }

  const rest = tables.filter((table) => !seen.has(table)).sort((a, b) => a.localeCompare(b));
  return [...ordered, ...rest];
}

async function runPrismaDbPush(targetUrl) {
  let prismaCliPath;
  try {
    prismaCliPath = require.resolve("prisma/build/index.js");
  } catch {
    console.warn("[sync-with-users] Prisma CLI not found. Skipping target schema init.");
    return;
  }

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [prismaCliPath, "db", "push", "--schema", "prisma/schema.prisma", "--skip-generate"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DATABASE_URL: targetUrl,
        DIRECT_URL: targetUrl
      },
      stdio: "inherit"
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`prisma db push failed with exit code ${code}`));
      }
    });
  });
}

async function getPublicTables(client) {
  const rows = await client.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name"
  );

  return rows
    .map((row) => (typeof row.table_name === "string" ? row.table_name : ""))
    .filter(Boolean);
}

async function getPublicColumns(client, tableName) {
  const rows = await client.$queryRawUnsafe(
    `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = ${quoteLiteral(tableName)} ORDER BY ordinal_position`
  );

  return rows
    .map((row) => (typeof row.column_name === "string" ? row.column_name : ""))
    .filter(Boolean);
}

async function getPublicColumnMeta(client, tableName) {
  const rows = await client.$queryRawUnsafe(
    `SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = ${quoteLiteral(tableName)} ORDER BY ordinal_position`
  );

  const map = new Map();
  for (const row of rows) {
    const columnName = typeof row.column_name === "string" ? row.column_name : "";
    if (!columnName) {
      continue;
    }

    map.set(columnName, {
      dataType: typeof row.data_type === "string" ? row.data_type : "",
      udtName: typeof row.udt_name === "string" ? row.udt_name : ""
    });
  }

  return map;
}

function buildValueExpression(index, columnMeta) {
  const placeholder = `$${index + 1}`;
  if (!columnMeta) {
    return placeholder;
  }

  const dataType = String(columnMeta.dataType || "").toLowerCase();
  const udtName = String(columnMeta.udtName || "");

  if (dataType === "user-defined" && udtName) {
    return `CAST(${placeholder} AS ${quoteIdent(udtName)})`;
  }

  if (dataType === "json") {
    return `CAST(${placeholder} AS JSON)`;
  }

  if (dataType === "array" && udtName.startsWith("_")) {
    const baseType = udtName.slice(1);
    if (baseType) {
      return `CAST(${placeholder} AS ${quoteIdent(baseType)}[])`;
    }
  }

  return placeholder;
}

async function readTableRows(source, tableName, columns) {
  if (columns.length === 0) {
    return [];
  }

  const quotedTable = quoteIdent(tableName);
  const quotedColumns = columns.map((column) => quoteIdent(column));
  const selectSql = `SELECT ${quotedColumns.join(", ")} FROM public.${quotedTable}`;
  return source.$queryRawUnsafe(selectSql);
}

async function insertTableRows(target, tableName, columns, rows, columnMetaMap) {
  if (columns.length === 0 || rows.length === 0) {
    return 0;
  }

  const quotedTable = quoteIdent(tableName);
  const quotedColumns = columns.map((column) => quoteIdent(column));
  const valueExpressions = columns
    .map((column, index) => buildValueExpression(index, columnMetaMap.get(column)))
    .join(", ");
  const insertSql = `INSERT INTO public.${quotedTable} (${quotedColumns.join(", ")}) VALUES (${valueExpressions})`;

  for (const row of rows) {
    const values = columns.map((column) => row[column]);
    await target.$executeRawUnsafe(insertSql, ...values);
  }

  return rows.length;
}

async function main() {
  const sourceUrl = readEnv("SOURCE_DATABASE_URL");
  const targetUrl = readEnv("TARGET_DATABASE_URL");

  if (sourceUrl === targetUrl && process.env.ALLOW_SAME_DATABASE !== "1") {
    throw new Error("SOURCE_DATABASE_URL and TARGET_DATABASE_URL are the same. Set ALLOW_SAME_DATABASE=1 to override.");
  }

  const source = createClient(sourceUrl);
  const target = createClient(targetUrl);

  try {
    console.log("[sync-with-users] Initializing target schema (create tables if missing)");
    try {
      await runPrismaDbPush(targetUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[sync-with-users] Schema init warning: ${message}`);
      console.warn("[sync-with-users] Continuing sync with existing target schema.");
    }

    const sourceTables = await getPublicTables(source);
    const targetTables = await getPublicTables(target);
    const targetTableSet = new Set(targetTables);
    const commonTables = sourceTables.filter((table) => targetTableSet.has(table));

    if (commonTables.length === 0) {
      throw new Error("No common tables found between source and target.");
    }

    const missingInTarget = sourceTables.filter((table) => !targetTableSet.has(table));
    for (const table of missingInTarget) {
      console.warn(`[sync-with-users] Skipping source table missing in target schema: ${table}`);
    }

    const orderedTables = stablePreferredOrder(commonTables);

    const stagedTables = [];
    for (const tableName of orderedTables) {
      const sourceColumns = await getPublicColumns(source, tableName);
      const targetColumns = await getPublicColumns(target, tableName);
      const targetColumnSet = new Set(targetColumns);
      const sharedColumns = sourceColumns.filter((column) => targetColumnSet.has(column));

      if (sharedColumns.length === 0) {
        console.warn(`[sync-with-users] Skipping table without shared columns: ${tableName}`);
        continue;
      }

      const targetColumnMeta = await getPublicColumnMeta(target, tableName);
      const rows = await readTableRows(source, tableName, sharedColumns);
      stagedTables.push({ tableName, sharedColumns, rows, targetColumnMeta });
      console.log(`[sync-with-users] Staged ${tableName}: ${rows.length}`);
    }

    const truncateSql = `TRUNCATE TABLE ${stagedTables.map((table) => `public.${quoteIdent(table.tableName)}`).join(", ")} CASCADE`;
    console.log("[sync-with-users] Truncating target tables");
    await target.$executeRawUnsafe(truncateSql);

    const tableCounts = [];
    for (const staged of stagedTables) {
      const copied = await insertTableRows(target, staged.tableName, staged.sharedColumns, staged.rows, staged.targetColumnMeta);
      const tableName = staged.tableName;
      tableCounts.push({ tableName, copied });
      console.log(`[sync-with-users] ${tableName}: ${copied}`);
    }

    console.log("[sync-with-users] Done");
    for (const { tableName, copied } of tableCounts) {
      console.log(`[sync-with-users] Summary ${tableName}: ${copied}`);
    }
  } finally {
    await Promise.allSettled([source.$disconnect(), target.$disconnect()]);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[sync-with-users] Failed: ${message}`);
  process.exit(1);
});
