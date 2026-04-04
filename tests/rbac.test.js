import request from "supertest";
import jwt from "jsonwebtoken";

import { createApp } from "../src/app.js";
import User from "../src/models/User.js";

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

describe("RBAC", () => {
  test("viewer cannot create record", async () => {
    const app = createApp();

    const viewer = await User.create({
      name: "Viewer",
      email: "viewer@example.com",
      password: "password123",
      role: "VIEWER"
    });
    const viewerToken = jwt.sign({ id: viewer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    const res = await request(app)
      .post("/api/records")
      .set(bearer(viewerToken))
      .send({
        amount: 100,
        type: "INCOME",
        category: "Salary",
        date: new Date().toISOString()
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  test("viewer can access dashboard summary", async () => {
    const app = createApp();

    const viewer = await User.create({
      name: "Viewer",
      email: "viewer2@example.com",
      password: "password123",
      role: "VIEWER"
    });
    const token = jwt.sign({ id: viewer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const res = await request(app).get("/api/dashboard/summary").set(bearer(token));
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("totalIncome");
    expect(res.body.data).toHaveProperty("totalExpense");
    expect(res.body.data).toHaveProperty("netBalance");
  });
});
