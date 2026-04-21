const express = require("express");

const { authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/me", (req, res) => {
  res.json({
    ok: true,
    user: {
      id: req.auth.userId,
      email: req.auth.email,
      role: req.auth.role
    }
  });
});

router.get("/health", authorizeRoles(["ADMIN", "EDITOR", "VIEWER"]), (_req, res) => {
  res.json({
    ok: true,
    area: "admin",
    time: new Date().toISOString()
  });
});

module.exports = router;