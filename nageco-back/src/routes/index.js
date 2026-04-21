const express = require("express");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const publicRoutes = require("./public");
const { authenticateAccessToken } = require("../middleware/auth");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/public", publicRoutes);
router.use("/admin", authenticateAccessToken, adminRoutes);

router.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "nageco-back",
    time: new Date().toISOString()
  });
});

router.get("/health/db", async (_req, res, next) => {
  try {
    const prisma = require("../lib/prisma");
    const dbResult = await prisma.$queryRaw`SELECT 1 AS ok`;
    const dbUp = Array.isArray(dbResult) && dbResult[0] && Number(dbResult[0].ok) === 1;

    res.json({
      ok: dbUp,
      service: "nageco-back",
      time: new Date().toISOString(),
      database: dbUp ? "up" : "unknown"
    });
  } catch (error) {
    res.status(503).json({
      ok: false,
      service: "nageco-back",
      time: new Date().toISOString(),
      database: "down",
      error: error && error.message ? error.message : "Database check failed"
    });
  }
});

module.exports = router;
