import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "../middleware/error-handler.js";

function buildAuthTestApp(authRoutes) {
  const app = express();
  app.use(express.json());
  app.use(cookieParser("test-secret"));
  app.use("/api/v1/auth", authRoutes);
  app.use(errorHandlerMiddleware);
  return app;
}

describe("Auth validators", () => {
  it("rejects login with missing fields", async () => {
    const { default: authRoutes } = await import("../routes/auth.js");
    const app = buildAuthTestApp(authRoutes);

    const res = await request(app).post("/api/v1/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.msg ?? res.body.message).toBeDefined();
  });

  it("rejects signup with invalid email", async () => {
    const { default: authRoutes } = await import("../routes/auth.js");
    const app = buildAuthTestApp(authRoutes);

    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({ name: "Test", email: "not-an-email", password: "123456" });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg ?? res.body.message).toBeDefined();
  });
});

