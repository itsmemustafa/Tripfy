import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

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
