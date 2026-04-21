const express = require("express");
const bcrypt = require("bcryptjs");

const { getJwtExpiresIn, signAccessToken } = require("../lib/jwt");

const router = express.Router();

function getPrismaClient() {
  try {
    return require("../lib/prisma");
  } catch (_error) {
    return null;
  }
}

router.post("/login", async (req, res) => {
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : "";
  const password = typeof req.body?.password === "string"
    ? req.body.password
    : "";

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      error: "Email and password are required"
    });
  }

  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return res.status(503).json({
        ok: false,
        error: "Database client unavailable"
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        error: "Invalid credentials"
      });
    }

    const accessToken = signAccessToken(user);

    return res.json({
      ok: true,
      tokenType: "Bearer",
      accessToken,
      expiresIn: getJwtExpiresIn(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Login failed"
    });
  }
});

module.exports = router;