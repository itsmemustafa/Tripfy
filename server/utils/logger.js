const isProd = process.env.NODE_ENV === "production";

function log(level, message, meta = {}) {
  const payload = {
    level,
    message,
    ...meta,
    timestamp: new Date().toISOString(),
  };
  if (isProd) {
    console.log(JSON.stringify(payload));
  } else {
    const prefix = `[${level.toUpperCase()}]`;
    if (Object.keys(meta).length) {
      console[level === "error" ? "error" : "log"](prefix, message, meta);
    } else {
      console[level === "error" ? "error" : "log"](prefix, message);
    }
  }
}

export default {
  info: (msg, meta) => log("info", msg, meta),
  warn: (msg, meta) => log("warn", msg, meta),
  error: (msg, meta) => log("error", msg, meta),
};
