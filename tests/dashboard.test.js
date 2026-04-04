import request from "supertest";
import jwt from "jsonwebtoken";

import { createApp } from "../src/app.js";
import User from "../src/models/User.js";
import FinancialRecord from "../src/models/FinancialRecord.js";

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

describe("Dashboard", () => {
  test("summary respects date range", async () => {
    const app = createApp();
    const viewer = await User.create({
      name: "Viewer",
      email: "viewer.dash@example.com",
      password: "password123",
      role: "VIEWER"
    });
    const token = jwt.sign({ id: viewer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    await FinancialRecord.create({
      amount: 100,
      type: "INCOME",
      category: "Salary",
      date: new Date("2026-01-01").toISOString(),
      createdBy: viewer._id,
      isDeleted: false
    });
    await FinancialRecord.create({
      amount: 50,
      type: "EXPENSE",
      category: "Food",
      date: new Date("2026-03-01").toISOString(),
      createdBy: viewer._id,
      isDeleted: false
    });

    const res = await request(app)
      .get("/api/dashboard/summary?startDate=2026-01-01&endDate=2026-01-31")
      .set(bearer(token));

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalIncome).toBe(100);
    expect(res.body.data.totalExpense).toBe(0);
    expect(res.body.data.netBalance).toBe(100);
  });
});
