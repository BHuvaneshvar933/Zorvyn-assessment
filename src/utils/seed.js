import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import FinancialRecord from "../models/FinancialRecord.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await FinancialRecord.deleteMany();

    console.log("Old data cleared");
    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: "ADMIN"
      },
      {
        name: "Analyst User",
        email: "analyst@test.com",
        password: hashedPassword,
        role: "ANALYST"
      },
      {
        name: "Viewer User",
        email: "viewer@test.com",
        password: hashedPassword,
        role: "VIEWER"
      }
    ]);

    console.log("Users seeded");
    const adminId = users[0]._id;

    await FinancialRecord.insertMany([
      {
        amount: 50000,
        type: "INCOME",
        category: "Salary",
        date: new Date(),
        notes: "Monthly salary",
        createdBy: adminId
      },
      {
        amount: 5000,
        type: "EXPENSE",
        category: "Food",
        date: new Date(),
        notes: "Groceries",
        createdBy: adminId
      },
      {
        amount: 10000,
        type: "EXPENSE",
        category: "Rent",
        date: new Date(),
        notes: "House rent",
        createdBy: adminId
      }
    ]);

    console.log("Records seeded");

    console.log("🌱 Seeding completed successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();