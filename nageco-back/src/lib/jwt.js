const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim().length < 32) {
    const error = new Error("JWT_SECRET is missing or too short");
    error.status = 500;
    throw error;
  }

  return secret.trim();
}

function getJwtExpiresIn() {
  return (process.env.JWT_EXPIRES_IN || "8h").trim();
}

function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "access"
    },
    getJwtSecret(),
    {
      expiresIn: getJwtExpiresIn(),
      issuer: "nageco-back",
      audience: "nageco-admin"
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    issuer: "nageco-back",
    audience: "nageco-admin"
  });
}

module.exports = {
  getJwtExpiresIn,
  signAccessToken,
  verifyAccessToken
};