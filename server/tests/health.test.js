import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import healthRouter from "../routes/health.js";

const app = express();
app.use("/api/v1/health", healthRouter);

describe("GET /api/v1/health", () => {
  it("returns health payload with status and db info", async () => {
    const res = await request(app).get("/api/v1/health");

    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("db");
    expect(res.body).toHaveProperty("timestamp");
  });
});

