import request from "supertest";
import jwt from "jsonwebtoken";

import { createApp } from "../src/app.js";
import User from "../src/models/User.js";

const bearer = (token) => ({ Authorization: `Bearer ${token}` });

describe("Auth middleware", () => {
  test("inactive user is blocked", async () => {
    const app = createApp();

    const user = await User.create({
      name: "Inactive",
      email: "inactive@example.com",
      password: "password123",
      role: "VIEWER",
      status: "INACTIVE"
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const res = await request(app).get("/api/dashboard/summary").set(bearer(token));

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("USER_INACTIVE");
  });
});
