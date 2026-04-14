import crypto from "crypto";
import config from "../config/index.js";

export function csrfProtection(req, res, next) {
  if (!config.csrf?.enabled) {
    return next();
  }

  const method = req.method.toUpperCase();
  const isSafe = method === "GET" || method === "HEAD" || method === "OPTIONS";
  if (isSafe) {
    return next();
  }

  const headerName = config.csrf.headerName.toLowerCase();
  const cookieName = config.csrf.cookieName;

  const headerToken = (req.headers[headerName] || "").toString();
  const cookieToken =
    (req.signedCookies && req.signedCookies[cookieName]) ||
    (req.cookies && req.cookies[cookieName]) ||
    "";

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    return res
      .status(403)
      .json({ msg: "Invalid or missing CSRF token" });
  }

  return next();
}

export function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(24).toString("hex");
  const cookieName = config.csrf.cookieName;

  res.cookie(cookieName, token, {
    httpOnly: false,
    secure: config.isProd,
    sameSite: config.isProd ? "none" : "lax",
  });

  res.json({ csrfToken: token });
}

