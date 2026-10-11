import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
const localEnvPath = path.join(__dirname, "..", ".env.local");

// Local overrides are gitignored. Missing values fall back to server/.env,
// so secrets do not need to be duplicated.
dotenv.config({ path: [localEnvPath, envPath] });

const required = ["MONGO_URL", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  const hint =
    "Create server/.env with MONGO_URL and JWT_SECRET (see server/.env.example).";
  throw new Error(`Missing required env: ${missing.join(", ")}. ${hint}`);
}

const env = process.env.NODE_ENV || "development";
const isProd = env === "production";

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : ["https://tripfy-myapp.vercel.app", "http://localhost:5173", "http://localhost:5174"];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (corsOrigins.includes(origin)) return true;

  // Vite may select a different port when 5173 is occupied.
  if (!isProd) {
    try {
      const { hostname, protocol } = new URL(origin);
      return (
        (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") &&
        (protocol === "http:" || protocol === "https:")
      );
    } catch {
      return false;
    }
  }

  return false;
};

export default {
  env,
  isProd,
  port: Number(process.env.PORT) || 3000,
  db: {
    url: process.env.MONGO_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessLifetime: process.env.JWT_LIFETIME || "1d",
  },
  cors: {
    origins: corsOrigins,
    isAllowedOrigin,
    credentials: true,
  },
  cookie: {
    signedSecret: process.env.COOKIE_SECRET || process.env.JWT_SECRET,
  },
  csrf: {
    enabled: process.env.CSRF_ENABLED === "true",
    cookieName: process.env.CSRF_COOKIE_NAME || "csrfToken",
    headerName: process.env.CSRF_HEADER_NAME || "x-csrf-token",
  },
  ai: {
    groqApiKey: process.env.GROQ_API_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiApiKey2: process.env.GEMINI_API_KEY2,
  },
};
