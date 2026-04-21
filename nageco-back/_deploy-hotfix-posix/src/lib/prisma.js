const path = require("path");

function loadPrismaClientModule() {
  const localClientPath = path.join(process.cwd(), "node_modules", "@prisma", "client");

  try {
    return require(localClientPath);
  } catch (_error) {
    return require("@prisma/client");
  }
}

const { PrismaClient } = loadPrismaClientModule();

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
