import request from "supertest";
import jwt from "jsonwebtoken";

import { createApp } from "../src/app.js";
import User from "../src/models/User.js";
import FinancialRecord from "../src/models/FinancialRecord.js";

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

describe("Records", () => {
  test("soft-deleted records are not returned", async () => {
    const app = createApp();

    const admin = await User.create({
      name: "Admin",
      email: "admin.records@example.com",
      password: "password123",
      role: "ADMIN"
    });
    const adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    await FinancialRecord.create({
      amount: 10,
      type: "INCOME",
      category: "A",
      date: new Date("2026-01-01").toISOString(),
      createdBy: admin._id,
      isDeleted: false
    });
    await FinancialRecord.create({
      amount: 20,
      type: "EXPENSE",
      category: "B",
      date: new Date("2026-01-02").toISOString(),
      createdBy: admin._id,
      isDeleted: true
    });

    const res = await request(app).get("/api/records").set(bearer(adminToken));
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe("A");
  });
});
