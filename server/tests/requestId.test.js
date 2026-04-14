import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import requestId from "../middleware/requestId.js";

const app = express();
app.use(requestId);
app.get("/ping", (req, res) => {
  res.json({ id: req.id });
});

describe("requestId middleware", () => {
  it("generates a request id when not provided", async () => {
    const res = await request(app).get("/ping");

    expect(res.headers["x-request-id"]).toBeDefined();
    expect(res.body.id).toBeDefined();
  });

  it("reuses incoming X-Request-Id header", async () => {
    const customId = "test-id-123";
    const res = await request(app)
      .get("/ping")
      .set("X-Request-Id", customId);

    expect(res.headers["x-request-id"]).toBe(customId);
    expect(res.body.id).toBe(customId);
  });
});

