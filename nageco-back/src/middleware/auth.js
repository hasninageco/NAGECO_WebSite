const { verifyAccessToken } = require("../lib/jwt");

function extractBearerToken(authorizationHeader = "") {
  if (typeof authorizationHeader !== "string") {
    return null;
  }

  const [scheme, token] = authorizationHeader.trim().split(/\s+/);
  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return null;
  }

  return token;
}

function authenticateAccessToken(req, res, next) {
  try {
    const token = extractBearerToken(req.get("authorization"));
    if (!token) {
      return res.status(401).json({
        ok: false,
        error: "Missing bearer token"
      });
    }

    const payload = verifyAccessToken(token);
    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch (_error) {
    return res.status(401).json({
      ok: false,
      error: "Invalid or expired token"
    });
  }
}

function authorizeRoles(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [];

  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        ok: false,
        error: "Forbidden"
      });
    }

    return next();
  };
}

module.exports = {
  authenticateAccessToken,
  authorizeRoles
};